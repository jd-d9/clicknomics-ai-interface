<template>
    <div>
        <loader-component v-if="showLoader"></loader-component>
        <v-card class="card_design mb-4">
            <v-card-title class="d-flex justify-space-between">
                {{ breadCrumbMessage }} Role
            </v-card-title>
            <v-divider class="border-opacity-100 my-4" color="success" />

            <form @submit.prevent="manageUserRole">
                <v-row>
                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Role Name</label>
                        <input type="text" id="input-username" name="Rolename"
                            :class="{ 'form-control': true, 'border-red-600': roleNameInvalid }" placeholder="Role Name"
                            v-model.trim="roleName" @blur="roleNameIsValid" />
                        <span class="text-red-600" v-if="roleNameInvalid">Role name is a required field</span>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal exapanded">
                        <div class="table align-items-center table-hover-class ma-0">
                            <div class="thead-light">
                                <div class="row">
                                    <div class="v-data-table__td_name col-4">
                                        <div class="v-data-table-header__content ms-3">Menu Name</div>
                                    </div>
                                    <div class="v-data-table__td col-2">
                                        <div class="v-data-table-header__content">View</div>
                                    </div>
                                    <div class="v-data-table__td col-2">
                                        <div class="v-data-table-header__content">Create</div>
                                    </div>
                                    <div class="v-data-table__td col-2">
                                        <div class="v-data-table-header__content">Edit</div>
                                    </div>
                                    <div class="v-data-table__td col-2">
                                        <div class="v-data-table-header__content">Delete</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div v-for="(item, ind) of menuItem" :key="ind">
                                    <!-- parents which have child(settings, accounting) are display here -->
                                    <div class="row form-row" v-if="item.child.length > 0">
                                        <div class="row add-border-bottom justify-start">
                                            <div class="v-data-table__td_name col-4">
                                                <ul class="userrole_menu_tree">
                                                    <li>
                                                        <v-icon icon="mdi-folder-open" class="mx-2"
                                                            color="#00cd00"></v-icon>
                                                        {{ item.menu }}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <!-- childs (Integrations, email notification) are display here -->
                                        <div class="row" v-for="(value, ind) of item.child" :key="ind">
                                            <div class="row add-border-bottom"
                                                :class="{ 'justify-start': value.child.length > 0 }">
                                                <div class="v-data-table__td_name col-4">
                                                    <ul class="userrole_menu_tree ms-5">
                                                        <li>
                                                            <v-icon icon="mdi-folder-open" class="mx-2" color="#00cd00"
                                                                v-if="value.child.length > 0"></v-icon>
                                                            <v-icon icon="mdi-file-outline" class="mx-2" color="#00cd00"
                                                                v-else></v-icon>
                                                            {{ value.menu }}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="v-data-table__td col-2" v-if="value.child.length == 0">
                                                    <label class="custom-toggle">
                                                        <input type="checkbox" class="form-control" v-model="value.view"
                                                            :disabled="isDisabled(value, 'view')"
                                                            @change="toggleChild(item, '', '', $event)">
                                                        <span class="custom-toggle-slider rounded-circle"
                                                            data-label-off="No" data-label-on="Yes"></span>
                                                    </label>
                                                </div>
                                                <div class="v-data-table__td col-2" v-if="value.child.length == 0">
                                                    <label class="custom-toggle">
                                                        <input type="checkbox" class="form-control"
                                                            v-model="value.create_auth"
                                                            :disabled="isDisabled(value, 'create')"
                                                            @change="toggleChild(item, '', '', $event)">
                                                        <span class="custom-toggle-slider rounded-circle"
                                                            data-label-off="No" data-label-on="Yes"></span>
                                                    </label>
                                                </div>
                                                <div class="v-data-table__td col-2" v-if="value.child.length == 0">
                                                    <label class="custom-toggle">
                                                        <input type="checkbox" class="form-control"
                                                            v-model="value.update_auth"
                                                            :disabled="isDisabled(value, 'edit')"
                                                            @change="toggleChild(item, '', '', $event)">
                                                        <span class="custom-toggle-slider rounded-circle"
                                                            data-label-off="No" data-label-on="Yes"></span>
                                                    </label>
                                                </div>
                                                <div class="v-data-table__td col-2" v-if="value.child.length == 0">
                                                    <label class="custom-toggle">
                                                        <input type="checkbox" class="form-control"
                                                            v-model="value.delete_auth"
                                                            :disabled="isDisabled(value, 'delete')"
                                                            @change="toggleChild(item, '', '', $event)">
                                                        <span class="custom-toggle-slider rounded-circle"
                                                            data-label-off="No" data-label-on="Yes"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <!-- sub-childs (Traffic Sources, network) are display here -->
                                            <div class="row" v-for="children of value.child" :key="children">
                                                <div class="row add-border-bottom"
                                                    :class="{ 'justify-start': children.child.length > 0 }">
                                                    <div class="v-data-table__td_name col-4">
                                                        <ul class="userrole_menu_tree ms-5 ps-5">
                                                            <li>
                                                                <v-icon icon="mdi-folder-open" class="mx-2" color="#00cd00"
                                                                    v-if="children.child.length > 0"></v-icon>
                                                                <v-icon icon="mdi-file-outline" class="mx-2" color="#00cd00"
                                                                    v-else></v-icon>
                                                                {{ children.menu }}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div class="v-data-table__td col-2" v-if="children.child.length == 0">
                                                        <label class="custom-toggle">
                                                            <input type="checkbox" class="form-control"
                                                                v-model="children.view"
                                                                :disabled="isDisabled(children, 'view')"
                                                                @change="toggleChild(item, value, '', $event)">
                                                            <span class="custom-toggle-slider rounded-circle"
                                                                data-label-off="No" data-label-on="Yes"></span>
                                                        </label>
                                                    </div>
                                                    <div class="v-data-table__td col-2" v-if="children.child.length == 0">
                                                        <label class="custom-toggle">
                                                            <input type="checkbox" class="form-control"
                                                                v-model="children.create_auth"
                                                                :disabled="isDisabled(children, 'create')"
                                                                @change="toggleChild(item, value, '', $event)">
                                                            <span class="custom-toggle-slider rounded-circle"
                                                                data-label-off="No" data-label-on="Yes"></span>
                                                        </label>
                                                    </div>
                                                    <div class="v-data-table__td col-2" v-if="children.child.length == 0">
                                                        <label class="custom-toggle">
                                                            <input type="checkbox" class="form-control"
                                                                v-model="children.update_auth"
                                                                :disabled="isDisabled(children, 'edit')"
                                                                @change="toggleChild(item, value, '', $event)">
                                                            <span class="custom-toggle-slider rounded-circle"
                                                                data-label-off="No" data-label-on="Yes"></span>
                                                        </label>
                                                    </div>
                                                    <div class="v-data-table__td col-2" v-if="children.child.length == 0">
                                                        <label class="custom-toggle">
                                                            <input type="checkbox" class="form-control"
                                                                v-model="children.delete_auth"
                                                                :disabled="isDisabled(children, 'delete')"
                                                                @change="toggleChild(item, value, '', $event)">
                                                            <span class="custom-toggle-slider rounded-circle"
                                                                data-label-off="No" data-label-on="Yes"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <!-- grand-childs (googleads, microsoftads) are display here -->
                                                <div class="row" v-for="grandChild of children.child" :key="grandChild">
                                                    <div class="row add-border-bottom"
                                                        :class="{ 'justify-start': grandChild.child.length > 0 }">
                                                        <div class="v-data-table__td_name col-4">
                                                            <ul class="userrole_menu_tree add-margin-left">
                                                                <li>
                                                                    <v-icon icon="mdi-folder-open" class="mx-2"
                                                                        color="#00cd00"
                                                                        v-if="grandChild.child.length > 0"></v-icon>
                                                                    <v-icon icon="mdi-file-outline" class="mx-2"
                                                                        color="#00cd00" v-else></v-icon>
                                                                    {{ grandChild.menu }}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div class="v-data-table__td col-2" v-if="grandChild.child.length == 0">
                                                            <label class="custom-toggle">
                                                                <input type="checkbox" class="form-control"
                                                                    v-model="grandChild.view"
                                                                    :disabled="isDisabled(grandChild, 'view')"
                                                                    @change="toggleChild(item, value, children, $event)">
                                                                <span class="custom-toggle-slider rounded-circle"
                                                                    data-label-off="No" data-label-on="Yes"></span>
                                                            </label>
                                                        </div>
                                                        <div class="v-data-table__td col-2"
                                                            v-if="grandChild.child.length == 0">
                                                            <label class="custom-toggle">
                                                                <input type="checkbox" class="form-control"
                                                                    v-model="grandChild.create_auth"
                                                                    :disabled="isDisabled(grandChild, 'create')"
                                                                    @change="toggleChild(item, value, children, $event)">
                                                                <span class="custom-toggle-slider rounded-circle"
                                                                    data-label-off="No" data-label-on="Yes"></span>
                                                            </label>
                                                        </div>
                                                        <div class="v-data-table__td col-2"
                                                            v-if="grandChild.child.length == 0">
                                                            <label class="custom-toggle">
                                                                <input type="checkbox" class="form-control"
                                                                    v-model="grandChild.update_auth"
                                                                    :disabled="isDisabled(grandChild, 'edit')"
                                                                    @change="toggleChild(item, value, children, $event)">
                                                                <span class="custom-toggle-slider rounded-circle"
                                                                    data-label-off="No" data-label-on="Yes"></span>
                                                            </label>
                                                        </div>
                                                        <div class="v-data-table__td col-2"
                                                            v-if="grandChild.child.length == 0">
                                                            <label class="custom-toggle">
                                                                <input type="checkbox" class="form-control"
                                                                    v-model="grandChild.delete_auth"
                                                                    :disabled="isDisabled(grandChild, 'delete')"
                                                                    @change="toggleChild(item, value, children, $event)">
                                                                <span class="custom-toggle-slider rounded-circle"
                                                                    data-label-off="No" data-label-on="Yes"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- parent (dashboard, ads-account) display here -->
                                    <div class="row form-row add-border-bottom" v-else>
                                        <div class="v-data-table__td_name col-4">
                                            <ul class="userrole_menu_tree ms-2">
                                                <li>
                                                    <v-icon icon="mdi-file-outline" class="mx-2" color="#00cd00"></v-icon>
                                                    {{ item.menu }}
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="v-data-table__td col-2">
                                            <label class="custom-toggle">
                                                <input type="checkbox" class="form-control" v-model="item.view"
                                                    :disabled="isDisabled(item, 'view')">
                                                <span class="custom-toggle-slider rounded-circle" data-label-off="No"
                                                    data-label-on="Yes"></span>
                                            </label>
                                        </div>
                                        <div class="v-data-table__td col-2">
                                            <label class="custom-toggle">
                                                <input type="checkbox" class="form-control" v-model="item.create_auth"
                                                    :disabled="isDisabled(item, 'create')">
                                                <span class="custom-toggle-slider rounded-circle" data-label-off="No"
                                                    data-label-on="Yes"></span>
                                            </label>
                                        </div>
                                        <div class="v-data-table__td col-2">
                                            <label class="custom-toggle">
                                                <input type="checkbox" class="form-control" v-model="item.update_auth"
                                                    :disabled="isDisabled(item, 'edit')">
                                                <span class="custom-toggle-slider rounded-circle" data-label-off="No"
                                                    data-label-on="Yes"></span>
                                            </label>
                                        </div>
                                        <div class="v-data-table__td col-2">
                                            <label class="custom-toggle">
                                                <input type="checkbox" class="form-control" v-model="item.delete_auth"
                                                    :disabled="isDisabled(item, 'delete')">
                                                <span class="custom-toggle-slider rounded-circle" data-label-off="No"
                                                    data-label-on="Yes"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <v-col cols="12" sm="12" md="12" lg="12">
                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3"
                        append-icon="mdi-content-save">Save</v-btn>
                    <v-btn type="reset" v-if="!toggleButton" class="text-none bg-red-darken-2 btn_animated"
                        append-icon="mdi-backup-restore">Reset</v-btn>
                </v-col>
            </form>
        </v-card>
    </div>
</template>

<script>
import axios from '@axios';
export default {
    data() {
        return {
            message: {},
            roleName: '',
            roleNameInvalid: '',
            showLoader: false,
            menuItem: [],
            toggleButton: false,
            headers: [
                { title: 'Menu Name', key: 'menu', align: 'start' },
                { title: 'Parent Menu', key: 'parent', align: 'start' },
                { title: 'View', key: 'view', align: 'center' },
                { title: 'Create', key: 'create', align: 'center' },
                { title: 'Edit', key: 'edit', align: 'center' },
                { title: 'Delete', key: 'delete', align: 'center' },
            ],
            view: 'No',
            create: 'No',
            edit: 'No',
            delete: 'No',
            itemsPerPage: -1,
            breadCrumbMessage: 'Create',
        }
    },
    mounted() {
        if (this.$route.params.id) {
            this.getUserRole();
            this.toggleButton = true;
            this.breadCrumbMessage = 'Edit';
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
            this.getAllUserRole();
        }
    },
    methods: {
        // get all user roles
        getAllUserRole() {
            this.showLoader = true;
            axios.get(this.$api + '/settings/rolemenulist', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
                .then(response => {
                    if (response.data.success) {
                        this.menuItem = response.data.data;
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    if (error.response.data.message) {
                        this.message = {
                            text: error.response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.error) {
                        this.message = {
                            text: error.response.data.error,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.errors) {
                        if (error.response.data.errors.length == 1) {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        } else if (error.response.data.errors.length == 0) {
                            this.backendErrorMessage = '';
                        } else {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        }
                    }
                    this.showLoader = false;
                });
        },
        // role name validation
        roleNameIsValid() {
            if (!this.roleName) {
                this.roleNameInvalid = 'Role name must not be empty';
            }
            else {
                this.roleNameInvalid = '';
            }
        },
        // get user role data for edit user role
        getUserRole() {
            this.showLoader = true;
            axios.get(this.$api + '/settings/role/' + this.$route.params.id + '/edit', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
                .then(response => {
                    if (response.data.success) {
                        const getData = response.data.data;
                        this.menuItem = getData.menus;
                        this.roleName = getData.role.role_name;
                        this.showLoader = false;
                    } else {
                        this.message = {
                            text: response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    if (error.response.data.message) {
                        this.message = {
                            text: error.response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.error) {
                        this.message = {
                            text: error.response.data.error,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.errors) {
                        if (error.response.data.errors.length == 1) {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        } else if (error.response.data.errors.length == 0) {
                            this.backendErrorMessage = '';
                        } else {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        }
                    }
                    this.showLoader = false;
                });
        },
        // create and update user role
        manageUserRole() {
            this.roleNameIsValid();
            // update user role
            if (this.$route.params.id) {
                if (!this.roleName || this.roleNameInvalid) {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    return false;
                }
                else {
                    this.showLoader = true;
                    axios.post(this.$api + '/settings/role/' + this.$route.params.id, {
                        role_name: this.roleName,
                        role_permission: JSON.stringify(this.menuItem),
                        _method: 'PUT'
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.getAccessToken()
                        }
                    })
                        .then(response => {
                            if (response.data.success) {
                                this.message = {
                                    text: response.data.message,
                                    type: 'success',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                                this.$router.push('/settings/user_management/user_roles');
                                this.showLoader = false;
                            } else {
                                this.message = {
                                    text: response.data.message,
                                    type: 'error',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                                this.showLoader = false;
                            }
                        })
                        .catch(error => {
                            if (error.response.data.message) {
                                this.message = {
                                    text: error.response.data.message,
                                    type: 'error',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                            }
                            if (error.response.data.error) {
                                this.message = {
                                    text: error.response.data.error,
                                    type: 'error',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                            }
                            if (error.response.data.errors) {
                                if (error.response.data.errors.length == 1) {
                                    this.message = {
                                        text: error.response.data.errors[0],
                                        type: 'error',
                                    }
                                    this.$eventBus.emit('flash-message', this.message, '');
                                } else if (error.response.data.errors.length == 0) {
                                    this.backendErrorMessage = '';
                                } else {
                                    this.message = {
                                        text: error.response.data.errors[0],
                                        type: 'error',
                                    }
                                    this.$eventBus.emit('flash-message', this.message, '');
                                }
                            }
                            this.showLoader = false;
                        });
                }
            }
            // create user role
            else {
                if (!this.roleName || this.roleNameInvalid) {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    return false;
                }
                else {
                    this.showLoader = true;
                    axios.post(this.$api + '/settings/role', {
                        role_name: this.roleName,
                        role_permission: JSON.stringify(this.menuItem)
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.getAccessToken()
                        }
                    })
                        .then(response => {
                            if (response.data.success) {
                                this.message = {
                                    text: response.data.message,
                                    type: 'success',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                                this.$router.push('/settings/user_management/user_roles');
                                this.showLoader = false;
                            } else {
                                this.message = {
                                    text: response.data.message,
                                    type: 'error',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                                this.showLoader = false;
                            }
                        })
                        .catch(error => {
                            if (error.response.data.message) {
                                this.message = {
                                    text: error.response.data.message,
                                    type: 'error',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                            }
                            if (error.response.data.error) {
                                this.message = {
                                    text: error.response.data.error,
                                    type: 'error',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                            }
                            if (error.response.data.errors) {
                                if (error.response.data.errors.length == 1) {
                                    this.message = {
                                        text: error.response.data.errors[0],
                                        type: 'error',
                                    }
                                    this.$eventBus.emit('flash-message', this.message, '');
                                } else if (error.response.data.errors.length == 0) {
                                    this.backendErrorMessage = '';
                                } else {
                                    this.message = {
                                        text: error.response.data.errors[0],
                                        type: 'error',
                                    }
                                    this.$eventBus.emit('flash-message', this.message, '');
                                }
                            }
                            this.showLoader = false;
                        });
                }
            }
        },
        // handle menu active or inactive
        handleMenuActive(parent, children, child) {
            if (child) {
                child.view = child.child.some(childMenu => childMenu.view || childMenu.create_auth || childMenu.delete_auth || childMenu.update_auth);
            } 
            if (children) {
                children.view = children.child.some(childMenu => childMenu.view || childMenu.create_auth || childMenu.delete_auth || childMenu.update_auth);
            }
            if (parent) {
                parent.view = parent.child.some(childMenu => childMenu.view || childMenu.create_auth || childMenu.delete_auth || childMenu.update_auth);
            }
        },
        // toggle parent value based on true value
        toggleChild(parent, children, child) {
            this.$nextTick(() => {
                this.handleMenuActive(parent, children, child);
            });
        },
        // make button disable
        isDisabled(value, type) {
            if (value.menu == 'Dashboard') {
                if (type != 'view') {
                    return true;
                }
            } else if (value.view != true && type == 'view') {
                return false;
                // return type == "view" ? false : true;
            } else if (value.resource) {
                const permission = value.resource.split(',');
                if (type == 'view') {
                    return permission.includes('0') ? false : true;
                } else if (type == 'create') {
                    return permission.includes('1') ? false : true;
                } else if (type == 'edit') {
                    return permission.includes('2') ? false : true;
                } else if (type == 'delete') {
                    return permission.includes('3') ? false : true;
                }
            } else {
                return false;
            }
        },

    },
}
</script>
<style scoped>.row {
    padding: 0 !important;
    min-height: 50px;
    align-items: center;
    justify-content: center;
}

.add-border-bottom {
    border-bottom: 1px solid #e5e5e5;
}

.add-margin-left {
    margin-left: 150px !important;
}

.thead-light>div,
.thead-light>div>div {
    background-color: #c7dcee !important;
}

.v-data-table__td_name>div {
    text-align: left !important;
    padding-left: 10px;
}

.v-data-table__td div,
.v-data-table__td {
    text-align: center !important;
}

.v-data-table-header__content {
    display: block !important;
}</style>
