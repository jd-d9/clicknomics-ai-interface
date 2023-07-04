<div class="d-flex justify-content-end align-items-center">
                        <div class="d-flex align-items-start justify-content-center me-3">
                            <small class="swithch-lable text-white">Light</small>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" @change="changeTheme" v-model="darkTheme">
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