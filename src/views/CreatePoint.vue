<template>
  <div class="page-create-point">
    <header>
      <img src="../assets/logo.svg" />

      <router-link to="/">
        <v-icon name="arrow-left" />
        Voltar para home
      </router-link>
    </header>

    <form @submit.prevent="handleSubmit">
      <h1>Cadastro do <br />ponto de coleta</h1>

      <fieldset>
        <legend>
          <h2>
            Dados
          </h2>
        </legend>

        <div class="field">
          <div class="field">
            <label for="name">
              Nome da entidade
            </label>

            <input type="text" name="name" id="name" v-model="name" />
          </div>

          <div class="field-group">
            <div class="field">
              <label for="email">
                E-mail
              </label>

              <input type="text" name="email" id="email" v-model="email" />
            </div>

            <div class="field">
              <label for="whatsapp">
                Whatsapp
              </label>

              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                v-model="whatsapp"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <h2>
            Endereço
          </h2>
          <span>
            Selecione o endereço o mapa
          </span>
        </legend>

        <l-map :center="center" :zoom="15" @click="handleMapClick">
          <l-tile-layer :url="url" :attribution="attribution" />

          <l-marker :lat-lng="withPopup">
            <l-icon
              icon-url="https://image.flaticon.com/icons/svg/1397/1397898.svg"
            />
          </l-marker>
        </l-map>

        <div class="field-group">
          <div class="field">
            <label for="uf">
              Estado (UF)
            </label>

            <select name="uf" id="uf" v-model="selectedUf">
              <option value="0">Selecione uma UF</option>
              <option :value="uf" v-for="uf in ufs" :key="uf">{{ uf }}</option>
            </select>
          </div>

          <div class="field">
            <label for="city">
              Cidade
            </label>

            <select name="city" id="city" v-model="selectedCity">
              <option value="0">Selecione uma cidade</option>
              <option :value="city" v-for="city in citys" :key="city">
                {{ city }}
              </option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <h2>
            Ítens de coleta
          </h2>
        </legend>

        <ul class="items-grid">
          <li
            v-for="item in items"
            :key="item.id"
            @click="handleSelectItem(item.id)"
            :class="selectedItems.includes(item.id) ? 'selected' : ''"
          >
            <img :src="item.image" alt="óleo" />
            <span>{{ item.title }}</span>
          </li>
        </ul>
      </fieldset>

      <button type="submit">
        Cadastrar ponto de coleta
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import { latLng, LeafletMouseEvent } from "leaflet";
import { LMap, LTileLayer, LMarker, LIcon } from "vue2-leaflet";
import api from "../services/api";
import axios from "axios";

interface UF {
  sigla: string;
}

interface City {
  nome: string;
}

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
  async mounted() {
    this.items = await this.getItems();
    this.ufs = await this.getUfs();

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      this.center = latLng(latitude, longitude);
    });
  },
  data() {
    return {
      zoom: 13,
      center: latLng(-28.4027282, -34.7381793),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(0, 0),
      withTooltip: latLng(0, 0),
      items: [],
      ufs: [],
      citys: [],
      selectedUf: "",
      selectedCity: "",
      selectedItems: [],
      name: "",
      email: "",
      whatsapp: "",
    };
  },
  methods: {
    async getItems() {
      const { data } = await api.get("/items");
      return data;
    },
    async getUfs() {
      const { data } = await axios.get(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      );

      const ufInitials = data.map((uf: UF) => uf.sigla);

      return ufInitials;
    },
    async getCitys(uf: string) {
      const { data } = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
      );

      const cityNames = data.map((city: City) => city.nome);

      return cityNames;
    },
    handleMapClick(event: LeafletMouseEvent) {
      this.withPopup = latLng([event.latlng.lat, event.latlng.lng]);
    },
    handleSelectItem(id: number) {
      const alreadySelected = this.selectedItems.findIndex(
        (item) => item === id
      );

      if (alreadySelected >= 0) {
        const filtredItems = this.selectedItems.filter((item) => item !== id);

        this.selectedItems = filtredItems;
      } else {
        const filtred = [...this.selectedItems, id] as never[];
        this.selectedItems = filtred;
      }
    },
    async handleSubmit() {
      const {
        name,
        email,
        whatsapp,
        selectedItems,
        selectedCity,
        selectedUf,
        withPopup,
      } = this;

      const data = {
        name,
        email,
        whatsapp,
        selectedItems,
        selectedCity,
        selectedUf,
        latitude: withPopup.lat,
        longitude: withPopup.lat,
      };

      const result = await api.post("points", data);

      console.log("aaaa",result);
    },
  },
  watch: {
    async selectedUf(value: string) {
      if (value === "0") return;

      this.citys = await this.getCitys(value);
    },
  },
};
</script>
<style>
.page-create-point {
  width: 100%;
  max-width: 1100px;

  margin: 0 auto;
}

.page-create-point header {
  margin-top: 48px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-create-point header a {
  color: var(--title-color);
  font-weight: bold;
  text-decoration: none;

  display: flex;
  align-items: center;
}

.page-create-point header a svg {
  margin-right: 16px;
  color: var(--primary-color);
}

.page-create-point form {
  margin: 80px auto;
  padding: 64px;
  max-width: 730px;
  background: #fff;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
}

.page-create-point form h1 {
  font-size: 36px;
}

.page-create-point form fieldset {
  margin-top: 64px;
  min-inline-size: auto;
  border: 0;
}

.page-create-point form legend {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.page-create-point form legend h2 {
  font-size: 24px;
}

.page-create-point form legend span {
  font-size: 14px;
  font-weight: normal;
  color: var(--text-color);
}

.page-create-point form .field-group {
  flex: 1;
  display: flex;
}

.page-create-point form .field {
  flex: 1;

  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.page-create-point form .field input[type="text"],
.page-create-point form .field input[type="email"],
.page-create-point form .field input[type="number"] {
  flex: 1;
  background: #f0f0f5;
  border-radius: 8px;
  border: 0;
  padding: 16px 24px;
  font-size: 16px;
  color: #6c6c80;
}

.page-create-point form .field select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  flex: 1;
  background: #f0f0f5;
  border-radius: 8px;
  border: 0;
  padding: 16px 24px;
  font-size: 16px;
  color: #6c6c80;
}

.page-create-point form .field input::placeholder {
  color: #a0a0b2;
}

.page-create-point form .field label {
  font-size: 14px;
  margin-bottom: 8px;
}

.page-create-point form .field :disabled {
  cursor: not-allowed;
}

.page-create-point form .field-group .field + .field {
  margin-left: 24px;
}

.page-create-point form .field-group input + input {
  margin-left: 24px;
}

.page-create-point form .field-check {
  flex-direction: row;
  align-items: center;
}

.page-create-point form .field-check input[type="checkbox"] {
  background: #f0f0f5;
}

.page-create-point form .field-check label {
  margin: 0 0 0 8px;
}

.page-create-point form .leaflet-container {
  width: 100%;
  height: 350px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.page-create-point form button {
  width: 260px;
  height: 56px;
  background: var(--primary-color);
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  border: 0;
  align-self: flex-end;
  margin-top: 40px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.page-create-point form button:hover {
  background: #2fb86e;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  list-style: none;
}

.items-grid li {
  background: #f5f5f5;
  border: 2px solid #f5f5f5;
  height: 180px;
  border-radius: 8px;
  padding: 32px 24px 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  text-align: center;

  cursor: pointer;
}

.items-grid li span {
  flex: 1;
  margin-top: 12px;

  display: flex;
  align-items: center;
  color: var(--title-color);
}

.items-grid li.selected {
  background: #e1faec;
  border: 2px solid #34cb79;
}
</style>
