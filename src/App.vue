<template>
    <div>
        <!-- navbar & sidebar component -->
        <nav-and-side-bar :updatingUserDetails="profileImageUpdate" @move-contents="moveRouteContents" v-if="toggleClass"></nav-and-side-bar>
        <router-view :class="{'padding-left': true, 'toggle-padding': !toggleContents, 'all-contents': toggleClass}" @updating-profile-details="updatingUserProfileDetails"></router-view>  
    </div>
</template>

<script>
    export default {
        data() {
            return {
                toggleContents: true,
                toggleClass: false,
                profileImageUpdate: '',
            }
        },
        mounted() {
            this.addDynamicClass();
        },
        methods: {
            // get value on click of navbar toggler button
            moveRouteContents(data) {
                this.toggleContents = data;
            },
            // dynamically add class for toggle sidebar
            addDynamicClass() {
                if(!sessionStorage.getItem('Email') || window.location.pathname === '/login' || window.location.pathname === '/password/reset' || window.location.pathname === '/authenticator/validate' || window.location.pathname === '/authenticator/validate/email' || window.location.pathname === '/set_new_password') {  
                    this.toggleClass = false;
                }
                else {
                    this.toggleClass = true;
                }
            },
            // updating user profile detail which stay in navbar
            updatingUserProfileDetails(data) {
                console.log(data, 'data');
                this.profileImageUpdate = data;
            }
        },
        watch: {
            $route(val) {
                this.addDynamicClass();
                if(val.fullPath === '/login') {
                    this.toggleContents = true;
                }
            }
        }
    }
</script>

<style>
    /* @import url(assets/css/argon.css);
    @import url(assets/css/dark-argon.css);
    @import url(assets/css/responsive.css); */
    .padding-left {
        padding-left: 0px;
    }
    .all-contents {
        padding-left: 300px !important;
        transition: all 0.2s ease;
    }
    .toggle-padding {
        padding-left: 60px !important;
        transition: all 0.2s ease;
    }
    /* table component */
    .v-table__wrapper {
        border-bottom: 1px solid #e0e0e0;
    }
    .v-field__outline {
        display: none !important;
    }
    .v-data-table-header__content {
        color: #136ab9 !important;
        font-size: 14px !important;
    }
    .v-data-table__td {
        background: #f0f0f0 !important;
    }
    .v-data-table-footer {
        font-size: 14px !important;
    }
    .v-data-table-footer__pagination button:nth-child(1),
    .v-data-table-footer__pagination button:nth-child(4) {
        display: none;
    }
    .v-field__append-inner {
        color: #136ab9;
    }
    .v-field__append-inner i {
        opacity: 1 !important;
    }
    .v-list-item:hover > .v-list-item__overlay {
        opacity: 0.1 !important;
    }
    .v-list-item__overlay {
        opacity: 0 !important;
    }
    /* manage email notification */
    .v-field--variant-filled {
        transform: translateY(-14px) !important;
    }
    .v-field--variant-filled .v-field__overlay {
        transform: translateY(-14px) !important;
        background: transparent !important;
        opacity: unset !important;
    }
    .v-selection-control__input::before {
        background-color: rgb(213 228 255) !important;
    }
    .v-selection-control__input i {
        /* border: 2px solid rgb(0 94 179) !important; */
        color: rgb(0 94 179) !important;
        border-radius: 4px;
    }
</style>
