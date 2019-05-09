<template>
  <q-page padding>
    <p>Generate C# Classes and Interfaces</p>

    <div class="row">
      <div class="col-2">
        <p class="caption">Main Solidity Contract</p>
      </div>
      <div class="col-2">
        <q-uploader
          ref="uploaderMain"
          hide-upload-button
          hide-upload-progress
          url
          :upload-factory="uploadMainContract"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-4">
        <br>
        <br>
        <br>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="caption">Other Solidity Contract(s)</p>
      </div>
      <div class="col-2">
        <q-uploader
          ref="uploaderOther"
          multiple
          batch
          hide-upload-button
          hide-upload-progress
          url
          :upload-factory="uploadContracts"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="caption">Compiler Version</p>
      </div>
      <div class="col-2">
        <q-select v-model="selectedCompiler" :options="selectCompilers"/>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <q-btn label="Generate" @click="OnClickGenerate"/>
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <q-input type="text" v-model="progress" stack-label="Progress:" disable/>
      </div>
    </div>
  </q-page>
</template>

<script>
import ContractCompiler from "../business/ContractCompiler";

export default {
  name: "Generate",
  data() {
    return {
      contract: {},
      contracts: {},
      selectCompilers: [],
      selectedCompiler: "v0.5.0-stable-2018.11.13",
      progress: ""
    };
  },
  async mounted() {
    const versions = await ContractCompiler.getVersions();
    this.selectCompilers = versions.map(x => ({ label: x, value: x }));
  },
  methods: {
    uploadMainContract(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Wait till complete
        reader.onloadend = async e => {
          const content = e.target.result;
          this.contract = {
            filename: file.name,
            content
          };
          console.log(this.contract);

          const c = new ContractCompiler(
            this.contract,
            this.contracts,
            "CustomNameSpace",
            true,
            true
          );
          const result = await c.generate(this.selectedCompiler);
          console.log(result);

          resolve(content);
        };

        // Make sure to handle error states
        reader.onerror = function(e) {
          reject(e);
        };

        // read text
        reader.readAsText(file);
      });
    },
    uploadContracts(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Wait till complete
        reader.onloadend = function(e) {
          const content = e.target.result;
          this.contracts = {};
          this.contracts[file.name] = content;
          console.log(this.contracts);

          resolve(content);
        };

        // Make sure to handle error states
        reader.onerror = function(e) {
          reject(e);
        };

        // read text
        reader.readAsText(file);
      });
    },
    async OnClickGenerate() {
      this.contract = {};
      this.contracts = {};
      this.$refs.uploaderMain.upload();

      console.log("here?");
      //console.log(this.contract);

      //this.contract.then((x) => console.log(x));

      // const c = new ContractCompiler(undefined, this.contract, this.contracts);
      // const result = c.generate();

      // this.$refs.uploaderOther.upload();
    }
  }
};
</script>
