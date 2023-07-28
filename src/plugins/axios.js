// axios
import axios from 'axios';
// import VueCryptojs from 'vue-cryptojs';
import CryptoJS from 'crypto-js';
axios.defaults.withCredentials = true;

const axiosIns = axios.create();

axiosIns.interceptors.request.use(
    config => {
        const userSession = localStorage.getItem('user-session');
        // to do
        if (userSession) {
            const decryptedObject = CryptoJS.AES.decrypt(userSession, "Clicknomics-AI").toString(CryptoJS.enc.Utf8)
            let sessionData = JSON.parse(decryptedObject)
            if(sessionData) {
                const isAuthenticated = sessionData.Token;
                const isVerified = sessionData.isTwoFactorVerified;
                const verifiedBy = sessionData.verifiedBy;
                if(isAuthenticated && isVerified) {
                    // if (window.location.pathname != '/dashboard') {
                    //     window.location.href = '/dashboard';
                    // }
                    if (window.location.pathname == '/authenticator/validate' && window.location.pathname == '/authenticator/validate/email' && window.location.pathname == '/login') {
                        window.location.href = '/dashboard';
                    }
                } else if(isAuthenticated && !isVerified) {
                    if(window.location.pathname != '/authenticator/validate' && verifiedBy == '2fa APP' && window.location.pathname != '/authenticator/validate/email') {
                        window.location.href = '/authenticator/validate';
                    } else if (window.location.pathname != '/authenticator/validate/email' &&  verifiedBy == 'email' && window.location.pathname != '/authenticator/validate') {
                        window.location.href = '/authenticator/validate/email';
                    } 
                }
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

// Response interceptor
axiosIns.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            // Handle 401 Unauthorized error
            localStorage.clear();
            // Redirect to login page or any other handling for 401 error
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

// Vue.prototype.$http = axiosIns

export default axiosIns
