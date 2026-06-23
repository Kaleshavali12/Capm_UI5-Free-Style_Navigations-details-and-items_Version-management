
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("ust.so.soreq.controller.SO", {



        onInit: function () {
            var oRoleModel = new JSONModel({
                role: ""
            });

            this.getOwnerComponent().setModel(oRoleModel, "roleModel");
            console.log("MODEL", this.getView().getModel());



            console.log(
    "Component Model",
    this.getOwnerComponent().getModel()
);
            this.getOwnerComponent().getModel().callFunction("/whoAmI", {

                method: "GET",

                success: function (oData) {
                    console.log("whoAmI Response:", oData);
                    console.log("User Role:", oData.whoAmI.role);
                    console.log("Email:", oData.whoAmI.email);

                    this.getOwnerComponent()
                        .getModel("roleModel")
                        .setProperty("/role", oData.whoAmI.role);

                }.bind(this),

                error: function (oError) {
                    console.error(oError);
                }
            });


        },

        onRowPress: function (oEvent) {

            //routing occurs here so creating one more view and controller for the details page. it has to navigate to another view
            // go to manifest.json and add the routing configuration for the details page and then create a new view and controller for the details page
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sPath = oContext.getPath();
            var oData = this.getView().getModel().getProperty(sPath);
            console.log("Selected Data:", oData);
            this.getOwnerComponent().getRouter().navTo("RouteDetail", {
                ID: oData.ID,
                VersionNo: oData.VersionNo,
                SalesOrderNo: oData.SalesOrderNo
            });
        },
        onCreatePress: function () {
            // Navigate to the create view
            console.log("Navigating to Create View");
            this.getOwnerComponent().getRouter().navTo("Create");
        },

    });
});
