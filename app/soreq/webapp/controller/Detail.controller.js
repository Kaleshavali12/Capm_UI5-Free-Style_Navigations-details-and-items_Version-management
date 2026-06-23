sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, ODataModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("ust.so.soreq.controller.Detail", {

        onInit: function () {

            console.log("Navigating");

            var oViewModel = new sap.ui.model.json.JSONModel({
                editMode: false
            });

            this.getView().setModel(oViewModel, "viewModel");

            this.getOwnerComponent()
                .getRouter()
                .getRoute("RouteDetail")
                .attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameters();
            console.log("Route Matched", oArgs);
            var sID = oArgs.arguments.ID;
            var sVersionNo = oArgs.arguments.VersionNo;
            var sSalesOrderNo = oArgs.arguments.SalesOrderNo;
            console.log("ID from route:", sID);
            var oModel = new ODataModel("/odata/v2/my/");
            console.log("Model =", oModel);
            console.log("Route Matched", oArgs); var sID = oArgs.arguments.ID; var sVersionNo = oArgs.arguments.VersionNo; var sSalesOrderNo = oArgs.arguments.SalesOrderNo; console.log("ID from route:", sID); var oModel = new ODataModel("/odata/v2/my/"); console.log("Model =", oModel);
            var sPath =
                "/SalesOrderHeaders(ID=guid'" + sID +
                "',VersionNo=" + sVersionNo +
                ",SalesOrderNo=" + sSalesOrderNo + ")";
            console.log("Constructed path:", sPath);
            this.getView().bindElement({
                path: sPath,
                parameters: {
                    $expand: 'Items'
                }
            });
            this.getView()
                .getModel("viewModel")
                .setProperty("/editMode", false);
                console.log("Overview Route Matched");

    this.getView()
        .getModel()
        .refresh(true);
            this._sPath = sPath;

        },
        onEdit: function () {

            console.log("Edit button pressed");
            this.getView()
                .getModel("viewModel")
                .setProperty("/editMode", true);
        },
        onSave: function () {

            var oModel = this.getView().getModel();
            var oContext = this.getView().getBindingContext();

            var oHeaderData = {
                ID: oContext.getProperty("ID"),
                SalesOrderNo: oContext.getProperty("SalesOrderNo"),
                VersionNo: oContext.getProperty("VersionNo"),
                Status: oContext.getProperty("Status"),

                CustomerId: this.byId("_IDGenInput7").getValue(),
                CustomerName: this.byId("_IDGenInput8").getValue(),
                Factory: this.byId("_IDGenInput9").getValue(),
                Currency: this.byId("_IDGenInput10").getValue(),
                TotalAmount: this.byId("_IDGenInput11").getValue(),
                RequestedDate: formatDate(
                    this.byId("_IDGenDatePicker3").getDateValue()
                ),
                OrderDate: formatDate(
                    this.byId("_IDGenDatePicker2").getDateValue()
                ),

            };

            var aItems = this.byId("_IDGenTable2")
                .getItems()
                .map(function (oItem) {

                    var aCells = oItem.getCells();

                    return {
                        ID: oItem.getBindingContext().getProperty("ID"),
                        ItemNo: aCells[0].getValue(),
                        MaterialNo: aCells[1].getValue(),
                        MaterialDescription: aCells[2].getValue(),
                        Quantity: aCells[3].getValue(),
                        UnitPrice: aCells[4].getValue(),
                        NetAmount: aCells[5].getValue()
                    };
                });

            oHeaderData.Items = aItems;

            console.log("PAYLOAD:", oHeaderData);

            oModel.update(this._sPath, oHeaderData, {
                success: function (oData) {

                    console.log("Updated Data:", oData);

                    sap.m.MessageToast.show("Updated Successfully");

                    this.getView()
                        .getModel("viewModel")
                        .setProperty("/editMode", false);

                    this.getOwnerComponent().getRouter().navTo("RouteDetail", {
                        ID: oData.ID,
                        VersionNo: oData.VersionNo,
                        SalesOrderNo: oData.SalesOrderNo
                    }, true // replace history
                    );

                }.bind(this),
                error: function (oError) {
                    console.error(oError);
                    sap.m.MessageToast.show("Update Failed");
                }
            });
        },
        onApprove: function () {

            var oData = this.getView().getBindingContext().getObject();

            this.getView().getModel().callFunction(
                "/SalesOrderHeaders_approve",
                {
                    method: "POST",
                    urlParameters: {
                        ID: oData.ID,
                        VersionNo: oData.VersionNo,
                        SalesOrderNo: oData.SalesOrderNo
                    },

                    success: function () {

                        sap.m.MessageToast.show("Approved Successfully");
                        
                        this.getOwnerComponent().getRouter().navTo(
                            "RouteSO",
                            {},
                            true
                        );
                        this.getView().getModel().refresh(true);

                    }.bind(this),

                    error: function (oError) {
                        console.error(oError);
                    }
                }
            );
        },
        onReject: function () {

            var oData = this.getView().getBindingContext().getObject();

            this.getView().getModel().callFunction(
                "/SalesOrderHeaders_rejectt",
                {
                    method: "POST",
                    urlParameters: {
                        ID: oData.ID,
                        VersionNo: oData.VersionNo,
                        SalesOrderNo: oData.SalesOrderNo
                    },

                    success: function () {

                        sap.m.MessageToast.show("Rejected Successfully");
                        this.getView().getModel().refresh(true);
                        this.getOwnerComponent().getRouter().navTo(
                            "RouteSO",
                            {},
                            true
                        );

                    }.bind(this),

                    error: function (oError) {
                        console.error(oError);
                    }
                }
            );
        },
        onDelete: function (oEvent) {

            var oContext = oEvent.getSource().getBindingContext();

            var sPath = oContext.getPath();

            console.log("Delete Path:", sPath);

            sap.m.MessageBox.confirm(
                "Are you sure you want to delete this record?",
                {
                    onClose: function (sAction) {

                        if (sAction === sap.m.MessageBox.Action.OK) {

                            this.getView().getModel().remove(sPath, {

                                success: function () {

                                    sap.m.MessageToast.show(
                                        "Deleted Successfully"
                                    );


                                    this.getView()
                                        .getModel()
                                        .refresh(true);
                                    this.getOwnerComponent().getRouter().navTo(
                                        "RouteSO",
                                        {},
                                        true
                                    );

                                }.bind(this),

                                error: function (oError) {

                                    console.error(oError);

                                    sap.m.MessageToast.show(
                                        "Delete Failed"
                                    );
                                }
                            });
                        }

                    }.bind(this)
                }
            );
        }
    });
    function formatDate(oDate) {
        if (!oDate) return null;

        const d = new Date(oDate);

        return d.toISOString().split("T")[0];
    }
});