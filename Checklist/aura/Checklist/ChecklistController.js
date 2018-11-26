({
    doInit : function(component, event, helper) {
		helper.getChecklistItems(component);
        helper.getHeadingValue(component);
        helper.getFilterValues(component);
    },
    
    openModalWindow : function(component, event, helper){
        component.set("v.modalIsOpen", true);
    },
    
    createNewRecord : function(component,event,helper){
        event.preventDefault(); //stops form submission
    	var eventFields = event.getParam("fields");
        var checklistId = component.get("{!v.checkListUser.Id}");
        var complete = eventFields["Status__c"];
        var completationStatus = eventFields["Completation_Status__c"];
        var completedAt = eventFields["Completed_At__c"];

        eventFields["Checklist__c"] = checklistId;
        
        if(complete === 'Completed' || completationStatus === true){
            
            if(complete === 'Completed'){
                eventFields["Completation_Status__c"] = true;
            }
            
            if(completationStatus === true){
                eventFields["Status__c"] = 'Completed';
            }
            
            if(completedAt === null){
                var d = new Date();
            	var dateString = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
            	eventFields["Completed_At__c"] = dateString;
            }
        }
        component.find("checklistItemForm").submit(eventFields);
    },
    
    cancelNewRecord : function(component, event, helper){
        component.set("v.modalIsOpen", false);
    },
    
    successNewRecord : function(component, event, helper){
        helper.getChecklistItems(component);
        component.set("v.modalIsOpen", false);
    },
    
    showIcon : function(component, event, helper){
        document.getElementById("heading").style.display = "inline-block";
    },
 
    hideIcon : function(component, event, helper){
        document.getElementById("heading").style.display = "none";
    },
    
    editHeading : function(component, event, helper){
        document.getElementById("headingValue").style.display = "none";
        document.getElementById("heading").style.display = "none";
        document.getElementById("inputHeading").style.display = "inline-block";

    },
    
    confirmInput : function(component, event, helper){
        if(event.which == 13 || event.keyCode == 13){
            document.getElementById("headingValue").style.display = "inline-block";
        	document.getElementById("heading").style.display = "inline-block";
        	document.getElementById("inputHeading").style.display = "none";
            helper.updateHeading(component);
        }

        return;
    },
    
    changeFilter : function(component, event, helper){
        helper.getChecklistItems(component);
    }
})