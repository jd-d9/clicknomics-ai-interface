<template>
    <div>
        <v-layout>
            <!-- sidebar default start here -->
            <v-navigation-drawer class="sidebar navbar-vertical navbar-light" v-if="hideShowSidebar">
                <v-list-item class="pa-0">
                    <div class="text-center bg-white py-3 px-2 sticky-top">
                        <router-link to="/dashboard" class="sidebar-logo">
                            <img src="/assets/img/brand/logo.png" class="d-full" :class="{'d-none': !hideShowSidebar}" alt="logo">
                            <img src="/assets/img/brand/favicon.png" class="d-half" :class="{'d-none': hideShowSidebar}" alt="logo">
                        </router-link>
                    </div>                    
                </v-list-item>
                <v-list nav class="pa-0">
                    <v-list-item class="pa-0">
                        <div class="sidebar-contents">
                            <router-link :to="data.routes === '#' ? '' : '/' + data.routes" class="side-menu text-decoration-none" :class="{'active-tab-big': addActiveClass(data)}" v-for="data in allMenues" :key="data" @click="changeSidebar(data)">
                                <img :src="'/assets/img/icons/' + data.icon" alt="icon" title="Dashboard">
                                <span class="inner-text text-primary" :class="{'d-none': !hideShowSidebar}">{{ data.menu }}</span>
                                <i class="fa-solid fa-angle-right ms-auto" v-if="data.child"></i>
                            </router-link>
                        </div>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <!-- sidebar default end here -->

            <!-- sidebar small start here -->
            <v-navigation-drawer class="sidebar navbar-vertical navbar-light hide-show-sidebar" v-else>
                <div class="sidebar-inner-wrapper">
                    <v-list-item class="pa-0">
                        <div class="text-center py-3 px-2">
                            <router-link to="/dashboard" class="sidebar-logo">
                                <img src="/assets/img/brand/logo.png" class="d-full" :class="{'d-none': !hideShowSidebar}" alt="logo">
                                <img src="/assets/img/brand/favicon.png" class="d-half" :class="{'d-none': hideShowSidebar}" alt="logo">
                            </router-link>
                        </div>                  
                    </v-list-item>
                    <v-list nav class="pa-0">
                        <v-list-item class="pa-0">
                            <div class="sidebar-contents">
                                <router-link :to="data.routes === '#' ? '' : '/' + data.routes" class="side-menu text-decoration-none side-menu-hover" :class="{'active-tab': addActiveClass(data)}" @mouseenter="showHoveredDropdown(data)" :id="ind + 'tab'" v-for="(data, ind) in allMenues" :key="data.id">
                                    <img :src="'/assets/img/icons/' + data.icon" alt="icon">
                                    <span class="inner-text text-primary" :class="{'d-none': !hideShowSidebar}">{{ data.menu }}</span>
                                    <i class="fa-solid fa-angle-right ms-auto" v-if="data.child"></i>
                                    <!-- add tooltip -->
                                    <v-tooltip activator="parent" location="bottom" v-if="!data.child">{{data.menu}}</v-tooltip>
                                </router-link>
                                <!-- sidebar dropdown start here -->

                                <div v-for="data in selectedMenu" :key="data" @mouseleave="hideHoveredDropdown">
                                    <div class="sidebar-dropdown-menu side_submenuitem" :class="{'d-block': showOnClick && data.child}">
                                        <div class="sidebar-dropdown-head px-3 py-2">
                                            <p class="mb-0 text-white py-1">{{ data.menu }}</p>
                                        </div>
                                        <v-expansion-panels>
                                            <v-expansion-panel v-for="subChild in data.child" :key="subChild">
                                                <div v-if="subChild.children.length !== 0">
                                                    <v-expansion-panel-title expand-icon="mdi-menu-down">
                                                        {{ subChild.menu }}
                                                    </v-expansion-panel-title>
                                                    <v-expansion-panel-text v-for="childs in subChild.children" :key="childs">
                                                        <div v-if="!childs.children">
                                                            <router-link :to="childs.routes === '#' ? '' : '/' + childs.routes">
                                                                {{ childs.menu }}
                                                            </router-link>
                                                        </div>
                                                        <div v-else>
                                                            <router-link :to="childs.routes === '#' ? '' : '/' + childs.routes">
                                                                <div class="accordion accordion-flush" :id="'accordionPanelsStayOpenExample' + childs.id">
                                                                    <div class="accordion-item">
                                                                        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#' + subChild.id" aria-expanded="false" aria-controls="flush-collapseOne">
                                                                                (1,2) {{ childs.menu }}
                                                                            </button>
                                                                        </h2>
                                                                        <div :id="subChild.id" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne" :data-bs-parent="'#accordionPanelsStayOpenExample' + childs.id">
                                                                            <div class="accordion-body">
                                                                                <router-link :to="childs.routes === '#' ? '' : '/' + childs.routes" class="accordian-hover" v-for="grandChilds in childs.children" :key="grandChilds">{{ grandChilds.menu }}</router-link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </router-link>
                                                        </div>
                                                    </v-expansion-panel-text>
                                                </div>
                                                <div v-else class="sidebar-dropdown-menubars">
                                                    <router-link :to="subChild.routes === '#' ? '' : '/' + subChild.routes">{{ subChild.menu }}</router-link>
                                                </div>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- <div class="sidebar-dropdown-menubars p-0">
                                            <div v-for="subChild in data.child" :key="subChild">
                                                <div v-if="subChild.children.length !== 0">
                                                    <div class="accordion" id="accordionPanelsStayOpenExample">
                                                        <div class="accordion-item">
                                                            <h2 class="accordion-header" :id="'panelsStayOpen-heading' + subChild.id">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#panelsStayOpen-collapse' + subChild.id" aria-expanded="false" :aria-controls="'panelsStayOpen-collapse' + subChild.id">
                                                                    {{ subChild.menu }}
                                                                </button>
                                                            </h2>
                                                            <div :id="'panelsStayOpen-collapse' + subChild.id" class="accordion-collapse collapse" :aria-labelledby="'panelsStayOpen-heading' + subChild.id" data-bs-parent="#accordionPanelsStayOpenExample">
                                                                <div class="accordion-body" v-for="childs in subChild.children" :key="childs">
                                                                    <router-link :to="childs.routes === '#' ? '' : '/' + childs.routes" class="accordian-hover" v-if="!childs.children">{{ childs.menu }}</router-link>
                                                                    <router-link :to="childs.routes === '#' ? '' : '/' + childs.routes" class="accordian-hover" v-else>
                                                                        <div class="accordion accordion-flush" :id="'accordionPanelsStayOpenExample' + childs.id">
                                                                            <div class="accordion-item">
                                                                                <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                                                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#' + subChild.id" aria-expanded="false" aria-controls="flush-collapseOne">
                                                                                        {{ childs.menu }}
                                                                                    </button>
                                                                                </h2>
                                                                                <div :id="subChild.id" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne" :data-bs-parent="'#accordionPanelsStayOpenExample' + childs.id">
                                                                                    <div class="accordion-body">
                                                                                        <router-link :to="childs.routes === '#' ? '' : '/' + childs.routes" class="accordian-hover" v-for="grandChilds in childs.children" :key="grandChilds">{{ grandChilds.menu }}</router-link>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </router-link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <router-link :to="subChild.routes === '#' ? '' : '/' + subChild.routes" class="text-primary">{{ subChild.menu }}</router-link>
                                                </div>
                                            </div>
                                        </div> -->
                                    </div>
                                </div>
                                <!-- sidebar dropdown end here -->
                            </div>
                        </v-list-item>
                    </v-list>
                </div>
            </v-navigation-drawer>
            <!-- sidebar small end here -->

            <loader-component v-if="showLoader"></loader-component>

            <v-main :class="{'toggle-margin': hideShowSidebar}" class="navbar-content pa-0">
                <v-app-bar color="primary" style="position:relative; width: 100%;left: 0 !important;">
                    <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>
                    <v-spacer></v-spacer>
                    <div class="d-flex align-items-start justify-content-center me-3">
                        <small class="swithch-lable text-white">Light</small>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked">
                        </div>
                        <small class="swithch-lable text-light">Dark</small>
                    </div>

                    <v-menu>
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
                    </v-menu>

                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn class="text-none" stacked v-bind="props">
                                <div class="d-flex align-center">
                                    <v-avatar size="36px">
                                        <v-img alt="Avatar" :src="profileImage ? profileImage : '/assets/img/icons/dummy-user.png'" ></v-img>
                                    </v-avatar>
                                    <v-list-item-title class="text-subtitle-2 ml-2">
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
                                    <router-link to="/my_profile" class="dropdown-item py-2 px-4">
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
                        
        </v-layout>
    </div>
</template>

<script>
    export default {
        emits: ['move-containts'],
        props: ['updatingUserDetails'],
        data() {
            return {
                hideShowSidebar: true,
                showLoader: false,
                showOnClick: false,
                sideBarData: [],
                allMenues: [],
                selectedMenu: [],
                subDropDownTabs: [],
                profileImage: '',
                name: '',
                darkTheme: localStorage.getItem('dark-theme') ? localStorage.getItem('dark-theme') : false,
            }
        },
        mounted() {
            this.toggleComponents();
            this.getSidebarMenues();
            this.getCurrentUserData();
            this.addDarkThemeClass();
            window.addEventListener('resize', () => {
                this.toggleComponents();
                if(screen.width < 1200) {
                    this.hideShowSidebar = false;
                }
                else {
                    this.hideShowSidebar = true;
                }
                this.$emit('move-contents', this.hideShowSidebar);
            });
        },
        methods: {
            // added css active class for current tab
            addActiveClass(route) {
                if(route.routes == '#') {
                    let active = [];
                    route.child.map((val) => {
                        if(val.routes == '#') {
                            val.children.filter((data) => {
                                data.routes == window.location.pathname.slice(1) && active.push(val);
                            })
                        }
                        else {
                            val.routes == window.location.pathname.slice(1) && active.push(val);
                        }
                    })
                    return active.length != 0 ? true : false;
                }
                else {
                    return route.routes == window.location.pathname.slice(1);
                }
            },
            // get sidebar menu tabs
            getSidebarMenues() { 
                this.showLoader = true;
                this.axios.get(this.$api + '/settings/menu', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.allMenues = response.data.data;
                        this.allMenues.sort((a, b) => a.position - b.position);
                        console.log(this.allMenues, 'sidebarAllData');
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    this.showLoader = false;
                    console.log(error);
                });
            },
            // hide/show components
            toggleComponents() {
                this.hideShowSidebar = false;
                if(screen.width > 1199) {
                    if(window.location.pathname === '/dashboard' || this.$route.params.notFound) {   //  || window.location.pathname === '/add-accounts' || window.location.pathname === '/campaigns' || window.location.pathname === '/servers'
                        this.hideShowSidebar = true;
                    } else {
                        this.hideShowSidebar = false;
                    }
                    this.$emit('move-contents', this.hideShowSidebar);
                }
            },
            // toggle sidebar and dropdown
            toggleSidebar() {
                if(window.location.pathname === '/dashboard' && screen.width > 1199) {  
                    this.hideShowSidebar = !this.hideShowSidebar;
                    this.$emit('move-contents', this.hideShowSidebar);
                } else {
                    // get active menu dropdown data
                    this.allMenues.filter((elem) => {
                        if(elem.routes == '#') {
                            elem.child.map((val) => {
                                if(val.routes == '#') {
                                    val.children.filter((data) => {
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
                this.axios.post(this.$api + '/logout', bodyParameters, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.showLoader = false;
                        sessionStorage.clear();
                        this.$toast.open({
                            message: 'Logged out',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.$router.push('/login');
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
                this.axios.get(this.$api + '/settings/getprofileuser', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.profileImage = response.data.data.profile_image;
                        this.name = response.data.data.name;
                        this.backendErrorMessage = '';
                        this.showLoader = false;
                        sessionStorage.setItem('roleId', response.data.data.role_id)
                    }
                })
                .catch(error => {
                    this.backendErrorMessage = error.response.data.message;
                    this.showLoader = false;
                }); 
            },
            // change theme light and dark
            changeTheme(e) {
                localStorage.setItem('dark-theme', e.target.checked);
                if(e.target.checked) {
                    document.body.classList.add('dark-mode');
                }
                else {
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
            }
        },
        watch: {
            updatingUserDetails(val) {
                if(val === 'update') {
                    this.getCurrentUserData();
                }
            },
            $route() {
                this.toggleComponents();
            }
        }
    } 
</script>
