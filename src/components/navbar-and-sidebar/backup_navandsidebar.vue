<template>
    <!-- sidebar default start here -->
    <div class="sidebar" v-if="hideShowSidebar">
        <div class="sidebar-inner">
            <div class="text-center bg-white py-3 px-2 sticky-top">
                <router-link to="/dashboard" class="sidebar-logo">
                    <img src="/assets/img/brand/logo.png" class="d-full" :class="{'d-none': !hideShowSidebar}" alt="logo">
                    <img src="/assets/img/brand/favicon.png" class="d-half" :class="{'d-none': hideShowSidebar}" alt="logo">
                </router-link>
            </div>
            <div class="sidebar-contents">
                <router-link :to="data.routes === '#' ? '' : '/' + data.routes" class="side-menu text-decoration-none" :class="{'active-tab-big': addActiveClass(data)}" v-for="data in allMenues" :key="data" @click="changeSidebar(data)">     <!--    -->
                    <img :src="'/assets/img/icons/' + data.icon" alt="icon" title="Dashboard">
                    <span class="inner-text text-primary" :class="{'d-none': !hideShowSidebar}">{{ data.menu }}</span>
                    <i class="fa-solid fa-angle-right ms-auto" v-if="data.child"></i>
                </router-link>
            </div>
        </div>
    </div>
    <!-- sidebar default end here -->
    <!-- sidebar small start here -->
    <div class="sidebar hide-show-sidebar" v-else>
        <div class="sidebar-inner-wrapper">
            <div class="sidebar-inner">
                <div class="text-center py-3 px-2">
                    <router-link to="/dashboard" class="sidebar-logo">
                        <img src="/assets/img/brand/logo.png" class="d-full" :class="{'d-none': !hideShowSidebar}" alt="logo">
                        <img src="/assets/img/brand/favicon.png" class="d-half" :class="{'d-none': hideShowSidebar}" alt="logo">
                    </router-link>
                </div>
                <div class="sidebar-contents">
                    <router-link :to="data.routes === '#' ? '' : '/' + data.routes" class="side-menu text-decoration-none side-menu-hover" :class="{'active-tab': addActiveClass(data)}" @mouseenter="showHoveredDropdown(data)" :id="ind + 'tab'" v-for="(data, ind) in allMenues" :key="data.id">
                        <img :src="'/assets/img/icons/' + data.icon" alt="icon" :title="data.menu">
                        <span class="inner-text text-primary" :class="{'d-none': !hideShowSidebar}">{{ data.menu }}</span>
                        <i class="fa-solid fa-angle-right ms-auto" v-if="data.child"></i>
                    </router-link>
                    <!-- sidebar dropdown start here -->
                    <div v-for="data in selectedMenu" :key="data" @mouseleave="hideHoveredDropdown">
                        <div class="sidebar-dropdown-menu" :class="{'d-block': showOnClick && data.child}">
                            <div class="sidebar-dropdown-head px-3 py-2">
                                <p class="mb-0 text-white py-1">{{ data.menu }}</p>
                            </div>
                            <div v-for="subChild in data.child" :key="subChild">
                                <div class="sidebar-dropdown-menubars p-0" v-if="subChild.children.length !== 0">
                                    <!-- accordian start here -->
                                    <div class="accordion" id="accordionPanelsStayOpenExample">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header" :id="'panelsStayOpen-heading' + subChild.id">
                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#panelsStayOpen-collapse' + subChild.id" aria-expanded="false" :aria-controls="'panelsStayOpen-collapse' + subChild.id">
                                                    {{ subChild.menu }}
                                                </button>
                                            </h2>
                                            <div :id="'panelsStayOpen-collapse' + subChild.id" class="accordion-collapse collapse" :aria-labelledby="'panelsStayOpen-heading' + subChild.id" data-bs-parent="#accordionPanelsStayOpenExample">
                                                <div class="accordion-body" v-for="childs in subChild.children" :key="childs">
                                                    <!-- <router-link :to="childs.routes === '#' ? '' : '/' + childs.routes" class="accordian-hover">{{ childs.menu }}</router-link> -->
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
                                    <!-- accordian end here -->
                                </div>
                                <div class="sidebar-dropdown-menubars" v-else>
                                    <router-link :to="subChild.routes === '#' ? '' : '/' + subChild.routes">{{ subChild.menu }}</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- sidebar dropdown end here -->
                </div>
            </div>
        </div>
    </div>
    <!-- sidebar small end here -->
    <loader-component v-if="showLoader"></loader-component>
    <!-- navbar start here -->
    <nav class="navbar-content bg-primary" :class="{'toggle-margin': hideShowSidebar}">
        <div class="container-fluid px-4 pt-0 pb-4">
            <div class="row justify-content-center align-items-center">
                <div class="col-xl-1 col-lg-1 col-md-7 col-sm-5 col-4">
                    <div class="sidenav-toggler" @click="toggleSidebar">
                        <div class="line line-one"></div>
                        <div class="line line-two"></div>
                        <div class="line line-three"></div>
                    </div>
                </div>
                <div class="col-xl-11 col-lg-11 col-md-5 col-sm-6 col-7 ms-auto text-end">
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="d-flex align-items-start justify-content-center me-3">
                            <small class="swithch-lable text-white">Light</small>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked">
                            </div>
                            <small class="swithch-lable text-light">Dark</small>
                        </div>
                        <div class="dropdown">
                            <button class="notification-icon btn dropdown-toggle position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="/assets/img/icons/bell.svg" alt="bell">
                                <span class="position-absolute translate-middle badge rounded-circle">5</span>
                            </button>
                            <ul class="dropdown-menu notification-dropdown">
                                <li class="notification-head"><small>You have <span class="text-primary">5</span> notification</small></li>
                                <li>
                                    <div class="dropdown-item">
                                        <p class="mb-0 text-black">5 months ago</p>
                                        <p class="mb-0">Microsoft Ads Account Web Redad Impression Equal To Zero</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="dropdown-item">
                                        <p class="mb-0 text-black">5 months ago</p>
                                        <p class="mb-0">Campaign Name RexMD ED Telemedicine (Display,Native) - US Only Network VERVE (Edwin) has conversion rate or EPC condition true</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="dropdown-item">
                                        <p class="mb-0 text-black">5 months ago</p>
                                        <p class="mb-0">Campaign Name (128585) [WEB+MOB] InstaHeat - CTC $59,95 /US (CPS) - CPA - $40.00 Network ClickDealer (Main) has conversion rate or EPC condition true</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="dropdown-item">
                                        <p class="mb-0 text-black">5 months ago</p>
                                        <p class="mb-0">Campaign Name [s] - EXCLUSIVE - Splash Wines - Christmas Holiday Special - 15 Bottles + A Chance to Win $100 Gift Card + Free Shipping - Sale Network W4 (Main) has conversion rate or EPC condition true</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="dropdown-item border-0">
                                        <p class="mb-0 text-black">5 months ago</p>
                                        <p class="mb-0">Campaign Name Beyond Body - eComm / Digital - SS - [All GEOs] Network GuruMedia has conversion rate or EPC condition true</p>
                                    </div>
                                </li>
                                <li class="text-center pt-2">
                                    <router-link to="/notification-list" class="view-all-notification d-block text-primary">View All</router-link>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown">
                            <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div class="d-flex align-items-center justify-content-end">
                                    <div class="profile-image me-2">
                                        <img :src="profileImage ? profileImage : '/assets/img/icons/dummy-user.png'" alt="img">
                                    </div>
                                    <p class="display-user-name mb-0 text-white">{{ name }} <i class="fa-solid fa-angle-down"></i></p>
                                </div>
                            </button>
                            <ul class="dropdown-menu profile-dropdown">
                                <li><small class="welcome">WELCOME!</small></li>
                                <li>
                                    <router-link to="/my_profile" class="dropdown-item">
                                        <i class="fa-solid fa-user"></i>
                                        <span class="profile-name ms-4">My Profile</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="" class="dropdown-item border-0" id="logout-button" @click="logoutUser">
                                        <i class="fa-solid fa-person-running"></i>
                                        <span class="profile-name ms-4">Logout</span>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <!-- navbar end here -->
</template>

<script>
    export default {
        emits: ['move-containts'],
        props: ['updatingUserDetails'],
        data() {
            return {
                // images: {
                //     logo: require('/assets/img/brand/logo.png'),
                //     favicon: require('/assets/img/brand/favicon.png'),
                //     bell: require('/assets/img/icons/bell.svg'),
                //     user: require('/assets/img/icons/dummy-user.png')
                // },
                hideShowSidebar: true,
                showLoader: false,
                showOnClick: false,
                sideBarData: [],
                allMenues: [],
                selectedMenu: [],
                subDropDownTabs: [],
                profileImage: '',
                name: '',
            }
        },
        mounted() {
            this.toggleComponents();
            this.getSidebarMenues();
            this.getCurrentUserData();
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
                // else {
                //     if(window.location.pathname === '/dashboard' || this.$route.params.notFound) {
                //         this.hideShowSidebar = false;
                //     } else {
                //         this.hideShowSidebar = true;
                //     }
                //     this.$emit('move-contents', this.hideShowSidebar);
                // }
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
                    // this.hideShowSidebar = !this.hideShowSidebar;
                }
                this.selectedMenu = [];
                this.selectedMenu.push(data);
                // this.showOnClick = true;
                // this.showOnClick = !this.showOnClick;
                // this.hideShowSidebar = !this.hideShowSidebar;
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

<style scoped>
    .navbar-content {
        margin-left: 60px;
    }
    .navbar-content-default {
        margin-left: 300px;
    }
    .toggle-margin {
        margin-left: 300px;
        transition: all 0.2s ease;
    }
    .bg-primary {
        background-color: #005eb3 !important;
    }
    .text-primary {
        color: #005eb3 !important;
    }
    .text-light {
        color: rgba(255, 255, 255, 0.5) !important;
    }
    .form-switch .form-check-input {
        height: 1.5rem;
        width: 3.1rem;
    }
    .form-switch {
        margin: 0 15px 0 30px;
    }
    .swithch-lable {
        margin-top: 5px
    }

    .btn:hover {
        box-shadow: none;
    }
    .form-check-input:checked {
        background-color: #293357;
        border-color: #293357;
        outline: none;
    }
    .form-check-input:focus {
        border-color: transparent !important;
        box-shadow: none;
    }
    .sidenav-toggler {
        width: 18px;
        cursor: pointer;
        transform: translateX(-5px);
    }
    .sidenav-toggler .line {
        margin-top: 3px;
        width: 100%;
        height: 2px;
        background-color: white;
    }
    .dropdown-toggle:focus, .btn.show {
        outline: none;
        border-color: transparent !important;
    }
    .dropdown-toggle img {
        width: 30px;
    }
    .dropdown-toggle::after {
        display: none;
    }
    .badge {
        font-size: 10px !important;
        color: black;
        background-color: #00cd00;
        top: 10px !important;
        left: 45px;
    }
    .sidebar {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0px;
        width: 300px;
        height: 100%;
        background-color: white;
        border-right: 1px solid #005eb3;
    }
    .sidebar-inner-wrapper {
        position: relative;
        z-index: 100;
    }
    .sidebar-inner {
        overflow-y: auto;
        height: 100vh;
    }
    .sidebar-inner::-webkit-scrollbar {
        width: 1px;
        background-color: white;
    }
    .sidebar-inner::-webkit-scrollbar-thumb {
        background-color: rgb(209, 209, 209);
    }
    .sidebar-dropdown-menu{
        display: none;
        position: absolute;
        z-index: 50;
        top: 0;
        left: 100%;
        box-shadow: 0px 0px 5px rgb(0 0 0 / 20%) inset;
        background-color: #e3ecf9;
        border-right: 1px solid #005eb3;
        width: 245px;
        height: 100vh;
        overflow-y: auto;
    }
    .side-menu-hover:hover, .active-tab {
        background-color: #084c89 !important;
        border-radius: 0 !important;
    }
    .side-menu-hover:hover i, .active-tab i {
        color: white;
    }
    .side-menu-hover:hover .sidebar-dropdown-menu{
        display: block !important;
    }
    .dropdown-item {
        padding: 14px 10px;
        border-bottom: 1px solid #eeeeee;
    }
    .dropdown-item:hover {
        background-color: #f6f9fc;
    }
    .dropdown-item p {
        font-size: 14px;
        color: #525f7f;
        white-space: pre-wrap;
        line-clamp: 3 !important;
    }
    .notification-dropdown {
        min-width: 420px;
        max-height: 500px;
        overflow: scroll !important;
        box-shadow: 0 50px 100px rgba(50, 50, 93, .1), 0 15px 35px rgba(50, 50, 93, .15), 0 5px 15px rgba(0, 0, 0, .1);
    }
    .notification-dropdown::-webkit-scrollbar {
        width: 6px;
        background-color: white;
    }
    .notification-dropdown::-webkit-scrollbar-thumb {
        background-color: rgb(209, 209, 209);
    }
    .notification-head {
        color: #525f7f;
        padding: 10px 0 20px 15px;
    }
    .view-all-notification {
        text-decoration: none;
        font-weight: 600;
        font-size: .875rem;
        padding: 0.9rem 1rem;
    }
    .view-all-notification:hover {
        color: #233dd2 !important;
        background-color: #e8f0fe;
    }
    .welcome {
        padding: 5px 10px;
        font-size: .625rem;
    }
    .profile-name {
        font-size: .875rem;
    }
    .profile-dropdown {
        min-width: 12rem;
        box-shadow: 0 50px 100px rgba(50, 50, 93, .1), 0 15px 35px rgba(50, 50, 93, .15), 0 5px 15px rgba(0, 0, 0, .1);
        border: none;
        border-radius: 8px 0 0 0 !important;
    }
    .profile-dropdown .dropdown-item:hover {
        background-color: #e3ecf9;
    }
    .profile-image {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: gray;
        overflow: hidden;
    }
    .profile-image img{
        width: 100%;
    }
    .sidebar-logo img{
        max-height: 2rem;
    }
    .profile-image + p {
        font-size: 14px;
    }
    .profile-image + p i {
        font-size: 12px;
    }
    .side-menu {
        display: flex;
        justify-content: start;
        align-items: center;
        border-radius: 6px;
        padding: 7px 12px;
    }
    .side-menu:hover, .active-tab-big {
        background-color: #e8f0fe;
    }
    .btn {
        padding: 5px 0 5px 20px;
    }
    .btn:not(:last-child) {
        margin-right: unset !important;
    }
    .side-menu i {
        font-size: 12px;
        font-weight: 900 !important;
    }
    .side-menu img {
        width: 30px;
        margin-right: 8px;
    }
    .side-menu-hover img {
        width: 30px;
        margin-right: 5px !important;
    }
    .side-menu span {
        font-size: .875rem;
    }
    .sidebar-dropdown-head {
        background-color: #084c89;
    }
    .sidebar-dropdown-menubars{
        cursor: pointer;
        font-size: .875rem;
        padding: 10px 0px 10px 20px;
    }
    /* .active-menu,  */
    .sidebar-dropdown-menubars:hover {
        background-color: #81df8d;
    }
    .sidebar-dropdown-menubars a{
        display: block;
        text-decoration: none;
        color: black;
    }
    .accordion-button {
        font-size: .875rem;
        padding: 10px 0px 10px 18px !important;
        border-left: 3px solid rgba(128, 128, 128, 0.1);
        background-color: #e3ecf9;
    }
    .accordion-item {
        border: none;
    }
    .accordion-button:hover {
        background-color: #81df8d;
    }
    .accordion-button:focus {
        box-shadow: none;
    }
    .accordion-button:not(.collapsed) {
        background-color: white;
        border-bottom: 1px solid rgba(0, 94, 179, 0.2);
        color: black !important;
    }
    @font-face {
        font-family: fontAwesomeFont;
        src: url(../../../public/assets/fonts/font_awesome/fa-solid-900.ttf);
        /* /assets/fonts/font_awesome/fa-solid-900.ttf */
    }
    .accordion-button::after {
        content: '\f105';
        display: flex;
        justify-content: center;
        align-items: center;
        color: #00cd00;
        font-family: fontAwesomeFont;
        background-image: none;
    }
    .accordion-button:not(.collapsed)::after {
        transform: rotate(90deg) !important;
    }
    .accordion-body {
        padding: 7px 18px;
        border-left: 3px solid rgba(128, 128, 128, 0.1);
    }
    .accordian-hover {
        display: block;
        border-radius: 5px;
        padding: 10px 10px;
    }
    .accordian-hover:hover {
        color: white;
        background-color: #005eb3;
    }
    .hide-show-sidebar {
        width: 60px;
        height: 100%;
        transition: all 0.2s ease;
    }
</style>