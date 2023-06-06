<template>
    <loader-component v-if="hideShowLoader"></loader-component>
    <!-- data table component -->
    <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, -1], itemsPerPageText: 'Rows per page:'}" :headers="headers" :items="users" :search="search" :itemsPerPage="itemsPerPage">
        <template v-slot:item="{ item }">
            <tr class="table-body-back">
                <th>{{item.selectable.id}}</th>
                <td>{{item.selectable.name}}</td>
                <td>{{item.selectable.email}}</td>
                <td>+{{item.selectable.country_code}} - {{item.selectable.phone_number}}</td>   <!-- .split('-')[0] -->
                <td>
                    <a href="javascript:void(0);" @click="editUser(item.selectable.id)">
                        <img :src="images.edit" class="icon-width" title="Edit user">
                    </a>
                    <a href="javascript:void(0);" @click="deleteUser(item.selectable.id)">
                        <img :src="images.bin" class="icon-width" title="Delete user">
                    </a>
                </td>
            </tr>
        </template>
    </v-data-table>
</template>

<script>
    export default {
        props: ['users', 'updateUserData'],
        data() {
            return {
                images: {
                    edit: require('../../assets/img/icons/edit.svg'),
                    bin: require('../../assets/img/icons/bin.svg'),
                },
                search: '',
                headers: [
                    { title: 'ID', key: 'id', align: 'start' },
                    { title: 'Name', key: 'name' },
                    { title: 'Email', key: 'email' },
                    { title: 'Mobile No.', key: 'phone_number' },
                    { title: 'Action', key: 'action', sortable: false },
                ],
                itemsPerPage: -1,
                hideShowLoader: false,
            }
        },
        methods: {
            // redirect on edit page
            editUser(id) {
                this.$router.push('/settings/user_management/users/' + id + '/edit');
            },
            // delete regestered user
            deleteUser(id) {
                console.log(id, 'id')
                this.hideShowLoader = true;
                this.axios.delete(this.$api + '/settings/user/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.hideShowLoader = false;
                        this.updateUserData();
                        this.$toast.open({
                            message: 'User deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.hideShowLoader = false;
                }); 
            }
        },
    }
</script>

<style scoped>

    .icon-width {
        width: 30px;
    }
    .table-body-back {
        font-size: 14px !important;
    }
    .table-body-back th {
        font-weight: 600 !important;
    }
</style>