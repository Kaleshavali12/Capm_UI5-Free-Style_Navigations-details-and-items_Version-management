namespace salesorder.db;

using {managed} from '@sap/cds/common';

entity SalesOrderHeader : managed {
    key ID                 : UUID;
    key VersionNo          : Integer    @readonly;
    key SalesOrderNo       : Integer    @readonly;
        CustomerId         : String(20);
        CustomerName       : String(100);
        Factory            : String(10);
        OrderDate          : Date;
        RequestedDate      : Date;

        Currency           : String(3);

        TotalAmount        : Decimal(15, 2);

        Status             : String(20) @readonly;
        customer        : String(40);
        buyerID            : String(40);

        Items              : Composition of many SalesOrderItem
                                 on Items.Header = $self;
        virtual CanApprove : Boolean;
        virtual CanReject  : Boolean;
}

entity SalesOrderItem : managed {
    key ID                  : UUID;

        Header              : Association to SalesOrderHeader;

        ItemNo              : Integer;

        MaterialNo          : String(40);
        MaterialDescription : String(255);

        Quantity            : Decimal(15, 3);
        UOM                 : String(10);

        UnitPrice           : Decimal(15, 2);
        NetAmount           : Decimal(15, 2);
}
