<template>
    <div class="main-content">
        <!-- Header -->
        <div class="header bg-gradient-primary py-5 pb-lg-7 pt-lg-6">
            <div class="container">
                <div class="header-body text-center mb-5">
                    <div class="row justify-content-center"> 
                        <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                            <h1 class="text-white"></h1>
                        </div>
                    </div>
                </div>
            </div>
            <div class="separator separator-bottom separator-skew zindex-100">
                <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
                </svg>
            </div>
        </div>
        <!-- Page content -->
        <div class="container mt--7 mt-lg--8 pb-5">
            <div class="row justify-content-center">
                <div class="col-lg-12 col-md-12">
                    <div class="card bg-secondary border-0 mb-0">
                        <div class="card-body px-lg-5 py-lg-5">
                            <div class="text-center logo_responsive">
                                <img :src="images.logo" class="img-width">
                            </div>
                            <div class="text-center mt-5">
                                <div class="number">404</div>
                                <div class="text"><span>Ooops...</span><br>page not found</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                images: {
                    logo: require('../../assets/img/brand/logo.png'),
                },
            }
        }
    }
</script>

<style scoped>
    .img-width {
        width: 30%;
    }
    .main-content {
        background-color: #e8f0fe;
    }
    .number {
        background: #fff;
        position: relative;
        font: 900 30vh "Consolas";
        letter-spacing: 5vh;
        text-shadow: 2px -1px 0 #000, 4px -2px 0 #0a0a0a, 6px -3px 0 #0f0f0f, 8px -4px 0 #141414, 10px -5px 0 #1a1a1a, 12px -6px 0 #1f1f1f, 14px -7px 0 #242424, 16px -8px 0 #292929;
    }
    .number::before {
        background-color: #7749c6;
        background-image: radial-gradient(closest-side at 50% 50%, #ffc107 100%, rgba(0, 0, 0, 0)), radial-gradient(closest-side at 50% 50%, #e91e63 100%, rgba(0, 0, 0, 0));
        background-repeat: repeat-x;
        background-size: 40vh 40vh;
        background-position: -100vh 20vh, 100vh -25vh;
        width: 100%;
        height: 100%;
        mix-blend-mode: screen;
        animation: moving 10s linear infinite both;
        display: block;
        position: absolute;
        content: "";
    }
    @keyframes moving {
        to {
            background-position: 100vh 20vh, -100vh -25vh;
        }
    }
    .text {
        font: 400 5vh "Courgette";
        color: #525f7f;
    }
    .text span {
        font-size: 10vh;
        color: #525f7f;
    }
</style>