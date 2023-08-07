<template>
  <div class="bg-default main-content-height">
      <loader-component v-if="showLoader"></loader-component>
      <v-container>
          <v-row class="ma-0">
              <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                  <v-breadcrumbs>
                      <router-link to="/dashboard" class="d-flex align-center">
                          <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                          <span>Dashboard</span>
                      </router-link>
                      <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                      <span>Website Speed Test Monitor</span>
                      <v-spacer />
                      <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                          Demo.csv
                      </v-btn>

                      <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                          Import CSV
                      </v-btn>
                      
                      <v-btn @click.prevent="createDomainModal" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                          Add New
                      </v-btn>
                  </v-breadcrumbs>
              </v-col>

              <v-col cols="12" sm="12" md="12" lg="12" class="py-0"><!-- v-if="permissions.view == '1' && !showLoader" -->
                  <v-card class="card_design mb-4">
                      <v-card-title class="d-flex align-center justify-end">
                        Website Speed Test Monitor List
                          <v-spacer></v-spacer>
                          <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                              <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" single-line hide-details />
                          </v-col>
                      </v-card-title>

                      <!-- data table component -->
                      <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="urlList" :search="search" :itemsPerPage="itemsPerPage">
                          <template v-slot:[`item.domain_url`]="{ item }">
                              <div class="text-ellipsis w-150">
                                  {{item.selectable.domain_url ? item.selectable.domain_url : '-'}}
                              </div>
                          </template>
                          <template v-slot:[`item.observed_last_visual_change`]="{ item }">
                              {{item.selectable.observed_last_visual_change ? item.selectable.observed_last_visual_change : '-'}}
                          </template>
                          <template v-slot:[`item.first_contentful_paint`]="{ item }">
                              {{item.selectable.first_contentful_paint ? item.selectable.first_contentful_paint : '-'}}
                          </template>
                          <template v-slot:[`item.speed_index`]="{ item }">
                              {{item.selectable.speed_index ? item.selectable.speed_index : '-'}}
                          </template>
                          <template v-slot:[`item.largest_contentful_paint`]="{ item }">
                              {{item.selectable.largest_contentful_paint ? item.selectable.largest_contentful_paint : '-'}}
                          </template>
                          <template v-slot:[`item.interactive`]="{ item }">
                              {{item.selectable.interactive ? item.selectable.interactive : '-'}}
                          </template>
                          <template v-slot:[`item.action`]>    
                              <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon>
                                <v-icon color="red-darken-4">
                                  mdi-delete-empty
                                </v-icon>
                                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                              </v-btn>  
                          </template>
                      </v-data-table>
                  </v-card>
              </v-col>
              <!-- <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                  <v-card class="card_design mb-4">
                      <v-card-title class="d-flex justify-content-center align-center">
                          You have no access for this page
                      </v-card-title>
                  </v-card>
              </v-col> -->
          </v-row>
      </v-container>

      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">Import Website Speed Test Monitor</h5>
                      <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                          <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                      </button>
                  </div>
                  <form @submit.prevent="uploadCsv">
                      <div class="modal-body">
                          <div class="file-upload">
                              <div class="file-select">
                                  <div class="file-select-button" id="fileName">Choose File</div>
                                  <div class="file-select-name" id="noFile" v-if="selectedFile">{{selectedFile.name}}</div>
                                  <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                  <input @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file" accept=".csv" name="selectFile" required/>
                              </div>
                          </div>
                      </div>
                      <div class="modal-footer pt-0">
                          <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                              <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-import">Import</v-btn>    
                              <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeModal">Close</v-btn>
                          </v-col>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      <div class="modal fade" id="adddomain" tabindex="-1" role="dialog" aria-labelledby="adddomainTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Add Website Speed Test Monitor</h5>
                      <button type="button" class="close" aria-label="Close" @click.prevent="closeDomainModal">
                          <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                      </button>
                  </div>
                  <form>
                      <div class="modal-body">
                          <v-row>
                              <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                  <label class="form-control-label" for="input-username">Domain</label>
                                  <Field type="text" id="input-username" name="Email" :class="{'form-control': true}" v-model="item.site_url" placeholder="Domain"/>
                              </v-col>
                          </v-row>
                      </div>
                      <div class="modal-footer">
                          <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                              <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                              <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeDomainModal">Close</v-btn>
                          </v-col>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
      return {
        message: {},
        urlList: [
            {
                domain_url:'getsparecar.com',
                observed_last_visual_change:'1.05 s',
                first_contentful_paint:'0.3 s',
                speed_index:'0.9 s',
                largest_contentful_paint:'0.3 s',
                interactive:'0.3 s',
                action:'',
            }
        ],
        showLoader: false,
        dialog: false,
        domain: '',
        resultData: '',
        ipAddress: '',
        search: '',
        headers: [
            { title: 'Site Url', key: 'domain_url'},
            { title: 'Page Speed', key: 'observed_last_visual_change' },
            { title: 'First Contentful', key: 'first_contentful_paint' },
            { title: 'Speed Index', key: 'speed_index' },
            { title: 'Largest Contentful', key: 'largest_contentful_paint' },
            { title: 'Interactive', key: 'interactive' },
            { title: 'Action', key: 'action' },
        ],
        itemsPerPage: -1,
        item: {
            id:'',
            site_url: '',
        },
        file: '',
      }
  },
  mounted() {
      window.scrollTo({
          top: 0,
          behavior: 'smooth',
      });
  },
  methods: {
      openModal() {
          window.$('#exampleModalCenter').modal('show');
      },
      closeModal() {
          window.$('#exampleModalCenter').modal('hide');
      },
      createDomainModal() {
          window.$('#adddomain').modal('show');
      },
      closeDomainModal() {
          window.$('#adddomain').modal('hide');
      },
  }
}
</script>

<style scoped>
</style>