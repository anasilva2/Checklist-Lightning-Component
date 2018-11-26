({
	handleErrors : function(errors){

        var toastParams = {
            title:"Error",
            message : "Unknown Error",
            type : "error"
        };
        
        if(errors && errors.length > 0){
            toastParams.message = errors[0].message;
        }
        
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    
	}
})