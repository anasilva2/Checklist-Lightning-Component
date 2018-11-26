({
    getChecklistItems : function(component) {
		var action = component.get("c.getUserChecklist");
        var filter = component.get("v.filterSelected");
        action.setParams({'filter' : filter});
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var value = response.getReturnValue();
                component.set("v.checkListUser",value);
            }
        })
        $A.enqueueAction(action);
    },
    
    getHeadingValue : function(component) {
		var action = component.get("c.getHeading");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var value = response.getReturnValue();
                component.set("v.headingValue",value);
            }
        })
        $A.enqueueAction(action);
    },
    
    updateHeading : function(component){
        var h = component.find("inpt").get("v.value");
        var action = component.get("c.updateHeading");
        action.setParams({"heading" : h});
        action.setCallback(this, function(response){
           var state = response.getState();
            if(state === "ERROR"){
                var errors = response.gerError();
                this.handleErrors(errors);
            }
        });
        $A.enqueueAction(action);

    },
    
    getFilterValues : function(component){
        var action = component.get("c.getFilters");
        action.setCallback(this, function(response){
           var state = response.getState();
            if(state === "SUCCESS"){
                var values = response.getReturnValue();
                component.set("v.filterOptions", values);
            }
        });
        
        $A.enqueueAction(action);
    },
    
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