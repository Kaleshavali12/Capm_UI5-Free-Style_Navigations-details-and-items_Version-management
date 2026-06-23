using salesorder.db as db from '../db/model';

service MyService {
    entity SalesOrderHeaders as projection on db.SalesOrderHeader actions {
        action approve();
        action rejectt();
    }
    entity SalesOrderItems as projection on db.SalesOrderItem;
    action sendReport() returns String;
    function whoAmI() returns {
    role     : String;
    email  : Boolean;
};
}


annotate MyService.SalesOrderHeaders with {
    SalesOrderNo  @Common.Label : 'Sales Order No';
    VersionNo     @Common.Label : 'Version';
    CustomerName  @Common.Label : 'Customer Name';
    Factory       @Common.Label : 'Factory';
    RequestedDate @Common.Label : 'Requested Date';
    Status        @Common.Label : 'Status';
    TotalAmount   @Common.Label : 'Amount';
};

annotate MyService.SalesOrderHeaders with @UI.LineItem : [
    { Value : SalesOrderNo },
    { Value : VersionNo },
    { Value : CustomerName },
    { Value : Factory },
    { Value : RequestedDate },
    { Value : Status },
    { Value : TotalAmount }
];