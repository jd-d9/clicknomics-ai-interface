<template>
    <div>
        <!-- navbar & sidebar component -->
        <nav-and-side-bar :updatingUserDetails="profileImageUpdate" @move-contents="moveRouteContents" v-if="toggleClass" ></nav-and-side-bar>
        <!-- toast message -->
        <flash-message></flash-message>
        <!-- router-view component -->
        <router-view :class="{'padding-left': true, 'toggle-padding': !toggleContents, 'all-contents': toggleClass}" @updating-profile-details="updatingUserProfileDetails">
        </router-view>  
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
                let userSession = localStorage.getItem('user-session')
                let Email
                if(userSession){
                    const decryptedObject = this.$CryptoJS.AES.decrypt(userSession, "Clicknomics-AI").toString(this.$CryptoJS.enc.Utf8)
                    let sessionData = JSON.parse(decryptedObject)
                    Email = sessionData.Email
                }

                if(!Email || window.location.pathname === '/login' || window.location.pathname === '/signup' || window.location.pathname === '/subscribe-plan' || window.location.pathname === '/password/reset' || window.location.pathname === '/authenticator/validate' || window.location.pathname === '/authenticator/validate/email' || window.location.pathname === '/authenticator/reset2FA' || window.location.pathname === '/set_new_password') {  
                    this.toggleClass = false;
                }
                else {
                    this.toggleClass = true;
                }
            },
            // updating user profile detail which stay in navbar
            updatingUserProfileDetails(data) {
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

