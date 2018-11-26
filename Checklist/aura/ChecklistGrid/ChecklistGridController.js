({
	changeStatus : function(component, event, helper) {
		var checklistitem = component.get("v.checklistItem");
        var controllerEvent = component.get("c.setStatus");
        controllerEvent.setParams({"item": checklistitem});
        controllerEvent.setCallback(this, function(response){
            var state = response.getState();
            
            if(state === "SUCCESS"){
                component.set("v.checklistItem", response.getReturnValue());
            }else if(state === "ERROR"){
                var errors = response.gerError();
                helper.handleErrors(errors);
            }
        })
        
        $A.enqueueAction(controllerEvent);
	},
    
    editChecklistItem : function(component,event,helper){
        component.set("{!v.modalIsOpen}", true);
    },
    
    createNewRecord : function(component,event,helper){
        //When the status is changed in the Edit button
        //Completation_Status and the completed date must also be changed
        event.preventDefault(); //stops form submission
    	var eventFields = event.getParam("fields");
        var status = eventFields["Status__c"];
        var completedAt = eventFields["Completed_At__c"];
        if(status === "Completed"){
            eventFields["Completation_Status__c"] = true;
            
            var d = new Date();
            var dateString = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
            eventFields["Completed_At__c"] = dateString;
        }else{
            eventFields["Completation_Status__c"] = false;
            eventFields["Completed_At__c"] = null;
        }
        component.find("checklistItemEditForm").submit(eventFields);
    },
    
    successNewRecord : function(component,event,helper){
        var id = component.get("{!v.checklistItemId}");
        var controllerEvent = component.get("c.getItem");
        controllerEvent.setParams({"identifier": id});
        controllerEvent.setCallback(this, function(response){
            var state = response.getState();
            
            if(state === "SUCCESS"){
                component.set("v.checklistItem", response.getReturnValue());
            }
        })
        
        $A.enqueueAction(controllerEvent);
        component.set("{!v.modalIsOpen}", false);
        
    },
    
    cancel : function(component,event,helper){
        component.set("{!v.modalIsOpen}", false);
        
    },
})