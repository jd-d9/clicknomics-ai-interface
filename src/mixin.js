// import VueCryptojs from 'vue-cryptojs'
export default {
    methods: {
        getAccessToken() {
            let userSession = localStorage.getItem('user-session')
            if(!userSession){
                return ''
            }
            const decryptedObject = this.$CryptoJS.AES.decrypt(userSession, "Clicknomics-AI").toString(this.$CryptoJS.enc.Utf8)
            let sessionData = JSON.parse(decryptedObject)

            return 'Bearer '+sessionData.Token;
        }
    }
}