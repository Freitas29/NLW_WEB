<template>
  <div class="page-create-point">
    <header>
      <img src="../assets/logo.svg" />

      <router-link to="/">
        <v-icon name="arrow-left" />
        Voltar para home
      </router-link>
    </header>

    <form>
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

            <input type="text" name="name" id="name" />
          </div>

          <div class="field-group">
            <div class="field">
              <label for="email">
                E-mail
              </label>

              <input type="text" name="email" id="email" />
            </div>

            <div class="field">
              <label for="whatsapp">
                Whatsapp
              </label>

              <input type="text" name="whatsapp" id="whatsapp" />
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

        <l-map :center="center" :zoom="15">
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

            <select name="uf" id="uf">
              <option value="0">Selecione uma UF</option>
            </select>
          </div>

          <div class="field">
            <label for="city">
              Cidade
            </label>

            <select name="city" id="city">
              <option value="0">Selecione uma cidade</option>
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
          <li v-for="item in items" :key="item.id">
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
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LIcon } from "vue2-leaflet";
import api from "../services/api";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
  async mounted() {
    const { data } = await api.get("/items");
    this.items = data;
  },
  data() {
    return {
      zoom: 13,
      center: latLng(-23.4027282, -46.7381793),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(-23.4027282, -46.7381793),
      withTooltip: latLng(-21.4027282, -46.7381793),
      currentZoom: 11.5,
      currentCenter: latLng(-23.4027282, -46.7381793),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
      items: [],
    };
  },
  methods: {},
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
