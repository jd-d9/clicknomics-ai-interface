<template>
    <div>
        <v-layout>
            <!-- sidebar start here -->
            <v-navigation-drawer class="sidebar navbar-vertical navbar-light" :class="{'hide-show-sidebar': !hideShowSidebar}">
                <div class="sidebar-inner-wrapper">
                    <v-list-item class="pa-0">
                        <div class="text-center py-3">
                            <router-link to="/dashboard" class="sidebar-logo">
                                <img src="/assets/img/brand/logo.png" class="d-full" :class="{'d-none': !hideShowSidebar}" alt="logo">
                                <img src="/assets/img/brand/favicon.png" class="d-half" :class="{'d-none': hideShowSidebar}" alt="logo">
                            </router-link>
                        </div>                  
                    </v-list-item>
                    <v-list nav class="pa-0">
                        <v-list-item class="pa-0">
                            <div class="sidebar-contents">
                                <router-link :to="data.routes === '#' ? '' : '/' + data.routes" class="side-menu text-decoration-none side-menu-hover" :class="{'active-tab': addActiveClass(data)}" @mouseenter="showHoveredDropdown(data)" :id="data.id + 'tab'" v-for="data in allMenues" :key="data.id">
                                    <img :src="'/assets/img/icons/' + data.icon" alt="icon">
                                    <span class="inner-text text-primary" :class="{'d-none': !hideShowSidebar}">{{ data.menu }}</span>
                                    <i class="fa-solid fa-angle-right ms-auto" v-if="data.child.length > 0"></i>
                                    <!-- add tooltip -->
                                    <v-tooltip activator="parent" location="bottom" v-if="data.child.length == 0">{{data.menu}}</v-tooltip>
                                </router-link>

                                <!-- sidebar dropdown start here -->
                                <div v-for="data in selectedMenu" :key="data" @mouseleave="hideHoveredDropdown">
                                    <div class="sidebar-dropdown-menu side_submenuitem" :class="{'d-block': showOnClick && data.child.length > 0}" @mouseover="setActiveHoverElement(data.id)" @mouseout="resetActiveHoverElement(data.id)">                                        
                                        <div class="sidebar-dropdown-head px-3 py-2" :class="{'d-none': hideShowSidebar}">
                                            <p class="mb-0 text-white" style="font-size: 14px;">{{ data.menu }}</p>
                                        </div>
                                        <v-expansion-panels>
                                            <v-expansion-panel v-for="subChild in data.child" :key="subChild">
                                                <!-- accordian start here -->
                                                <div v-if="subChild.child.length !== 0">
                                                    <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
                                                        {{ subChild.menu }}
                                                    </v-expansion-panel-title>
                                                    <v-expansion-panel-text v-for="childs in subChild.child" :key="childs">
                                                        <div v-if="childs.child.length == 0">
                                                            <router-link :to="childs.routes === '#' ? '' : '/' + childs.routes">
                                                                {{ childs.menu }}
                                                            </router-link>
                                                        </div>
                                                        <!-- child accordian start here -->
                                                        <div v-else>
                                                            <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
                                                                {{ childs.menu }}
                                                            </v-expansion-panel-title>
                                                            <v-expansion-panel-text v-for="grandChilds in childs.child" :key="grandChilds">
                                                                <div>
                                                                    <router-link :to="grandChilds.routes === '#' ? '' : '/' + grandChilds.routes">
                                                                        {{ grandChilds.menu }}
                                                                    </router-link>
                                                                </div>
                                                            </v-expansion-panel-text>
                                                        </div>
                                                        <!-- child accordian end here -->
                                                    </v-expansion-panel-text>
                                                </div>
                                                <!-- accordian end here -->
                                                <div v-else class="sidebar-dropdown-menubars">
                                                    <router-link :to="subChild.routes === '#' ? '' : '/' + subChild.routes">{{ subChild.menu }}</router-link>
                                                </div>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </div>
                                </div>
                                <!-- sidebar dropdown end here -->
                            </div>
                        </v-list-item>
                    </v-list>
                </div>
            </v-navigation-drawer>
            <!-- sidebar end here -->

            <loader-component v-if="showLoader"></loader-component>

            <!-- navbar component start here -->
            <v-main class="navbar-content pa-0" :class="{'toggle-margin': hideShowSidebar}">
                <v-app-bar color="primary" style="position:relative; width: 100%;left: 0 !important;">
                    <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>
                    <v-spacer></v-spacer>
                    <div v-if="trialDays">
                        <p class="text-white bg-deep-orange-accent-4 trial_text text-center mt-3" v-if="trialDays > 0">
                            Your trial period will expire in {{ trialDays }} {{ trialDays == 1 ? 'day' : 'days' }}.
                        </p>
                        <p class="text-white bg-deep-orange-accent-4 trial_text text-center mt-3" v-if="trialDays == 0">
                            Your trial expires today.
                        </p>
                    </div>
                    <v-spacer></v-spacer>

                    <!-- dark and light mode -->
                    <v-btn icon @click="changeTheme">
                        <div v-if="toggleIcon" >
                            <v-icon color="success" >
                                mdi-weather-night
                            </v-icon>
                            <v-tooltip activator="parent" location="left">Switch to Dark Theme</v-tooltip>
                        </div>
                        <div v-else>
                            <v-icon color="white">
                                mdi-white-balance-sunny
                            </v-icon>
                            <v-tooltip activator="parent" location="left">Switch to Light Theme</v-tooltip>
                        </div>
                    </v-btn>
                    <!-- <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn class="text-none" stacked v-bind="props">
                                <v-badge content="5" color="success">
                                    <v-icon>mdi-bell-outline</v-icon>
                                </v-badge>
                            </v-btn>
                        </template>
                        <v-card width="400">
                            <v-list lines="three" class="pa-0">
                                <v-list-subheader>
                                    <small>You have <span class="text-primary">5</span> notification</small>
                                </v-list-subheader>

                                <v-list-item>
                                    <v-list-item-title>5 months ago</v-list-item-title>
                                    <v-list-item-subtitle>
                                        Microsoft Ads Account Web Redad Impression Equal To Zero
                                    </v-list-item-subtitle>
                                </v-list-item>
                                <v-divider class="border-opacity-75 ma-0" color="success"></v-divider>

                                <v-list-item>
                                    <v-list-item-title>5 months ago</v-list-item-title>
                                    <v-list-item-subtitle>
                                        Campaign Name RexMD ED Telemedicine (Display,Native) - US Only Network VERVE (Edwin) has conversion rate or EPC condition true
                                    </v-list-item-subtitle>
                                </v-list-item>
                                <v-divider class="border-opacity-75 ma-0" color="success"></v-divider>

                                <v-list-item>
                                    <v-list-item-title>5 months ago</v-list-item-title>
                                    <v-list-item-subtitle>
                                        Campaign Name (128585) [WEB+MOB] InstaHeat - CTC $59,95 /US (CPS) - CPA - $40.00 Network ClickDealer (Main) has conversion rate or EPC condition true
                                    </v-list-item-subtitle>
                                </v-list-item>
                                <v-divider class="border-opacity-75 ma-0" color="success"></v-divider>

                                <v-list-item>
                                    <v-list-item-title>5 months ago</v-list-item-title>
                                    <v-list-item-subtitle>
                                        Campaign Name [s] - EXCLUSIVE - Splash Wines - Christmas Holiday Special - 15 Bottles + A Chance to Win $100 Gift Card + Free Shipping - Sale Network W4 (Main) has conversion rate or EPC condition true
                                    </v-list-item-subtitle>
                                </v-list-item>
                                <v-divider class="border-opacity-75 ma-0" color="success"></v-divider>
                            </v-list>
                            <v-list class="pa-0 text-center">
                                <router-link to="/notification-list" class="view-all-notification d-block text-primary">View All</router-link>
                            </v-list>
                        </v-card>
                    </v-menu> -->
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn class="text-none" stacked v-bind="props">
                                <div class="d-flex align-center">
                                    <v-avatar size="36px">
                                        <v-img alt="Avatar" :src="profileImage ? profileImage : '/assets/img/icons/dummy-user.png'" ></v-img>
                                    </v-avatar>
                                    <v-list-item-title class="text-subtitle-2 ml-2 text-capitalize">
                                        {{ name }} <i class="fa-solid fa-angle-down"></i>
                                    </v-list-item-title>
                                </div>
                            </v-btn>
                        </template>
                        <v-card width="200">
                            <v-list class="pa-0">
                                <v-list-subheader>
                                    <small class="welcome pa-0">WELCOME!</small>
                                </v-list-subheader>

                                <v-list-item class="pa-0">
                                    <router-link to="/my-profile" class="dropdown-item py-2 px-4">
                                        <i class="fa-solid fa-user"></i>
                                        <span class="profile-name ms-4">My Profile</span>
                                    </router-link>
                                </v-list-item>

                                <v-list-item class="pa-0">
                                    <router-link to="" class="dropdown-item border-0 py-2 px-4" id="logout-button" @click="logoutUser">
                                        <i class="fa-solid fa-person-running"></i>
                                        <span class="profile-name ms-4">Logout</span>
                                    </router-link>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-menu>
                </v-app-bar>
            </v-main>
            <!-- navbar component end here -->
                        
        </v-layout>
    </div>
</template>

<script>
    import axios from '@axios';
    import introJs from 'intro.js';
    import 'intro.js/minified/introjs.min.css';
    export default {
        emits: ['move-containts'],
        props: ['updatingUserDetails'],
        data() {
            return {
                hideShowSidebar: false,
                showLoader: false,
                showOnClick: false,
                sideBarData: [],
                allMenues: [],
                selectedMenu: [],
                subDropDownTabs: [],
                profileImage: '',
                name: '',
                darkTheme: localStorage.getItem('dark-theme') ? localStorage.getItem('dark-theme') : false,
                toggleIcon: false,
                trialDays: null,
                lastLogin: true,
            }
        },
        mounted() { 
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });       
            this.toggleComponents();
            this.getSidebarMenues();
            console.log('static');
            this.getCurrentUserData();
            this.addDarkThemeClass();
            // window.addEventListener('resize', () => {
            //     this.toggleComponents();
            //     if(screen.width < 1200) {
            //         this.hideShowSidebar = false;
            //     }
            //     else {
            //         this.hideShowSidebar = true;
            //     }
            //     this.$emit('move-contents', this.hideShowSidebar);
            // });
        },
        methods: {
            // added css active class for current tab
            addActiveClass(route) {
                if(route.routes == '#') {
                    let active = [];
                    route.child.map((val) => {
                        if(val.routes == '#') {
                            val.child.filter((data) => {
                                if(data.child.length > 0) {
                                    data.child.filter((data) => {
                                        data.routes == window.location.pathname.slice(1) && active.push(val);
                                    })
                                }else {
                                    data.routes == window.location.pathname.slice(1) && active.push(val);
                                }
                            })
                        }
                        else {
                            val.routes == window.location.pathname.slice(1) && active.push(val);
                        }
                    })
                    if(window.location.pathname == '/settings/networks') {
                        return route.menu == 'Settings' ? true : false;
                    }else {
                        return active.length != 0 ? true : false;
                    }
                }
                else {
                    return route.routes == window.location.pathname.slice(1);
                }
            },
            // set introjs step dynamically
            setIntroStep(val) {
                let step;
                if(val == 'Settings') {
                    step = 2;
                }
                if(val == 'Networks') {
                    step = 3;
                }
                if(val == 'Reporting') {
                    step = 4;
                }
                return step;
            },
            // set introjs title dynamically
            setIntroTitle(val) {
                let title;
                if(val == 'Settings') {
                    title = 'Integration!';
                }
                if(val == 'Networks') {
                    title = 'Network Integration!';
                }
                if(val == 'Reporting') {
                    title = 'Reporting!';
                }
                return title;
            },
            // set introjs description dynamically
            setIntroDescription(val) {
                let description;
                if(val == 'Settings') {
                    description = 'You can integrate your Google Ads and Microsoft Ads accounts from our setting menu.';
                }
                if(val == 'Networks') {
                    description = 'Please add all your manual networks using our networks page.';
                }
                if(val == 'Reporting') {
                    description = 'You can access all your real-time reports as well as archived reports from our reporting ;section.'
                }
                return description;
            },
            // close intro js package after show once
            closeIntroJs() { 
                axios.get(this.$api + '/firstTimeLoginUser', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        console.log(response);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            },
            // get sidebar menu tabs
            getSidebarMenues() { 
                this.showLoader = true;
                axios.get(this.$api + '/settings/menu', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        console.log(response,'response')
                        this.allMenues = response.data.data;
                        this.trialDays = response.data.trialEnd;
                        this.lastLogin = response.data.lastLogin;
                        console.log(this.allMenues, 'sidebarAllData');
                        this.showLoader = false;
                        if(this.lastLogin) {
                            setTimeout(() => {
                                introJs().onbeforeexit(() => {
                                    this.closeIntroJs();
                                }).start();
                            }, 600)
                        }
                    }
                })
                .catch(error => {
                    this.showLoader = false;
                    console.log(error);
                });
            },
            // hide/show components
            toggleComponents() {
                // if(screen.width > 1199) {
                    // if(window.location.pathname === '/dashboard' || window.location.pathname === '/add-accounts' || window.location.pathname === '/campaigns' || window.location.pathname === '/servers' || this.$route.params.notFound) {   //  || window.location.pathname === '/add-accounts' || window.location.pathname === '/campaigns' || window.location.pathname === '/servers'
                    //     this.hideShowSidebar = true;
                    // } 
                    // if(window.location.pathname === '/dashboard') {
                    //     this.hideShowSidebar = true;
                    // } 
                    // else {
                    //     this.hideShowSidebar = false;
                    // }
                    this.hideShowSidebar = false;
                    this.$emit('move-contents', this.hideShowSidebar);
                // }
            },
            // toggle sidebar and dropdown
            toggleSidebar() {
                if(window.location.pathname === '/dashboard') {   //  && screen.width > 1199
                    this.hideShowSidebar = !this.hideShowSidebar;
                    this.$emit('move-contents', this.hideShowSidebar);
                }
                // if(window.location.pathname === '/add-accounts' || window.location.pathname === '/campaigns' || window.location.pathname === '/servers' && screen.width > 1199) {  
                //     this.hideShowSidebar = !this.hideShowSidebar;
                //     this.$emit('move-contents', this.hideShowSidebar);
                // }
                else {
                    // get active menu dropdown data
                    this.allMenues.filter((elem) => {
                        if(elem.routes == '#') {
                            elem.child.map((val) => {
                                if(val.routes == '#') {
                                    val.child.filter((data) => {
                                        data.routes == window.location.pathname.slice(1) && this.selectedMenu.push(elem);
                                    })
                                }
                                else {
                                    val.routes == window.location.pathname.slice(1) && this.selectedMenu.push(elem);
                                }
                            })
                        }
                    })
                    this.showOnClick = !this.showOnClick;
                    this.hideShowSidebar = !this.hideShowSidebar;
                    this.$emit('move-contents', this.showOnClick);
                }
            },
            // change default sidebar to small(hover) sidebar
            changeSidebar(data) {
                if(data.child) {
                    this.showOnClick = true;
                    this.hideShowSidebar = !this.hideShowSidebar;
                }
                else {
                    this.showOnClick = false;
                }
                this.selectedMenu = [];
                this.selectedMenu.push(data);
            },
            // sidebar show dropdown on hover
            showHoveredDropdown(data) {
                this.selectedMenu = [];
                this.selectedMenu.push(data);
                this.showOnClick = true;
            },
            // sidebar hide dropdown on hover
            hideHoveredDropdown() {
                // this.selectedMenu = [];
                this.showOnClick = false;
                this.$emit('move-contents', this.hideShowSidebar);
            },
            // logout user
            logoutUser() {
                this.showLoader = true;
                const bodyParameters = {
                    key: "value"
                };
                axios.post(this.$api + '/logout', bodyParameters, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.showLoader = false;
                        sessionStorage.clear();
                        this.$router.push('/login');
                    }else {
                        this.showLoader = false;
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                }); 
            },
            // get current loged in user data
            getCurrentUserData() {
                this.showLoader = true;
                axios.get(this.$api + '/settings/getprofileuser', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.profileImage = response.data.data.profile_image;
                        this.name = response.data.data.first_name + ' ' + response.data.data.last_name;
                        this.backendErrorMessage = '';
                        this.showLoader = false;
                        sessionStorage.setItem('roleId', response.data.data.role_id)
                    }
                })
                .catch(error => {
                    this.backendErrorMessage = error.message;
                    this.showLoader = false;
                }); 
            },
            // change theme light and dark
            changeTheme() {
                this.toggleIcon = !this.toggleIcon;
                localStorage.setItem('dark-theme', this.toggleIcon);
                if(this.toggleIcon) {
                    // this.toggleIcon = true;
                    document.body.classList.add('dark-mode');
                }
                else {
                    // this.toggleIcon = false;
                    document.body.classList.remove('dark-mode');
                }
            },
            // add dark theme class to body
            addDarkThemeClass() {
                if(this.darkTheme == 'true') {
                    document.body.classList.add('dark-mode');
                }
                else {
                    document.body.classList.remove('dark-mode');
                }
            },
            setActiveHoverElement(id){
                const element = document.getElementById(id + 'tab');
                element.classList.add('active-tab')
            },
            resetActiveHoverElement(id){
                const element = document.getElementById(id + 'tab');
                element.classList.remove('active-tab')
            }
        },
        watch: {
            updatingUserDetails(val) {
                if(val) {
                    this.getCurrentUserData();
                }
            },
            $route() {
                this.toggleComponents();
            }
        }
    } 
</script>
