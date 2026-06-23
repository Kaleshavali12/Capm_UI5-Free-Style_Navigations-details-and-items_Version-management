sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (BaseController) => {
    "use strict";

    return BaseController.extend("ust.so.soreq.controller.Create", {
        onInit: function () {

            var oModel = new sap.ui.model.json.JSONModel();

            this.getView().setModel(oModel, "createModel");

            this.getOwnerComponent()
                .getRouter()
                .getRoute("Create")
                .attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function () {

            this.getView().getModel("createModel").setData({
                CustomerId: "",
                CustomerName: "",
                Factory: "",
                OrderDate: "",
                RequestedDate: "",
                Currency: "",
                Items: []
            });
        },
        onAddItem: function () {

            var oModel = this.getView().getModel("createModel");
            var aItems = oModel.getProperty("/Items");

            aItems.push({
                ItemNo: "",
                MaterialNo: "",
                Quantity: ""
            });

            oModel.setProperty("/Items", aItems);
        },
        onSave: function () {
            console.log('save clicked');

            var oData = this.getView().getModel("createModel").getData();
            var oODataModel = this.getView().getModel();

            console.log(oODataModel);

            if (oData.OrderDate) {
                oData.OrderDate = new Date(oData.OrderDate);
            }

            if (oData.RequestedDate) {
                oData.RequestedDate = new Date(oData.RequestedDate);
            }

            oODataModel.create("/SalesOrderHeaders", oData, {
                success: function () {

                    sap.m.MessageToast.show("Created successfully");

                    oODataModel.refresh(true);

                    this.getOwnerComponent()
                        .getRouter()
                        .navTo("RouteSO");

                }.bind(this),

                error: function (oError) {
                    console.error(oError);
                    sap.m.MessageBox.error("Creation failed");
                }
            });
        },
        onCancel: function () {

            this.getView().getModel("createModel").setData({
                CustomerId: "",
                CustomerName: "",
                Factory: "",
                OrderDate: "",
                RequestedDate: "",
                Currency: "",
                Items: []
            });

            this.getOwnerComponent().getRouter().navTo("RouteSO");
        }
    });
});