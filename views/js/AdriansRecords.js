//Function that calculates the total of the bill, using the records table as a parameter. 
function calculateBill(idrecordsTable) {
    var fBillTotal = 0.0; //variable that holds the bill's total, initialized to zero.
    var i = 0;//var used inside the for loop.
    var aCBTags = document.querySelectorAll('input');

    for (i = 0; i < aCBTags.length; i++) {
        // inside the for loop that checks if a box is ticked.
        if (aCBTags[i].checked) { //if statement body
            // get the checkbox's parent table row
            var oTR = getParentTag(aCBTags[i], 'TR'); //variable with the table row and calling of the getParentTag method below.
             var oTDPrice = oTR.getElementsByTagName('TD')[3];  // obtain the price from the price column, which is the fourth column.
            fBillTotal += parseFloat(oTDPrice.firstChild.data); //the var billtotal will be equal to the data held in the column
        };
    };
    return Math.round(fBillTotal * 100.0) / 100.0; //Return the price with two decimal places.
};


// Function for getting the parent tag of a given tag
function getParentTag(oNode, sParentType) {
    var oParent = oNode.parentNode;
    while (oParent) {
        if (oParent.nodeName == sParentType)
            return oParent;
        oParent = oParent.parentNode;
    };
    return oParent;
};