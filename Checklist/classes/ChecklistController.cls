public class ChecklistController {
    
    
    @AuraEnabled
    public static User retrieveUser(){
        
        try{
            User u = [SELECT Id,Name,Username,Profile.Name FROM User WHERE id =: UserInfo.getUserId()];
            return u;
        }catch(Exception ex){
            throw new AuraHandledException('We cannot retrieve the User!');
        }

    }
    
    @AuraEnabled
    public static Boolean hasChecklist(){
        List<Checklist__c> cl = [SELECT Id FROM Checklist__c WHERE User__c =: UserInfo.getUserId()];
        return cl.size() > 0;
    }
    
    
    @AuraEnabled
    public static Checklist__c getUserChecklist(String filter){
        List<Checklist__c> checkListUser; 
        
        if(filter.equals('All')){
            checkListUser = [SELECT Id,Name,User__r.Name,User__r.Profile.Name,Total_of_Checklist_Items__c,Checklist_Type__c,
                                      (SELECT Name,Description__c,Completation_Status__c, Status__c, Completed_At__c FROM ChecklistItems__r ORDER BY Createddate DESC) 
                                      FROM Checklist__c WHERE User__c =: UserInfo.getUserId()];
        }else{
            checkListUser = [SELECT Id,Name,User__r.Name,User__r.Profile.Name,Total_of_Checklist_Items__c,Checklist_Type__c,
                                      (SELECT Name,Description__c,Completation_Status__c, Status__c, Completed_At__c FROM ChecklistItems__r WHERE Status__c =: filter) 
                                      FROM Checklist__c WHERE User__c =: UserInfo.getUserId()];
        }
        
        
        if(checkListUser.size() > 0){
            return checkListUser.get(0);
        }else{
            return null;
        }
    }
    
    @AuraEnabled
    public static ChecklistItem__c setStatus(ChecklistItem__c item){
        item.Completed_At__c = item.Completation_Status__c ? Date.today() : null;
        item.Status__c = item.Completation_Status__c? 'Completed':'In Progress';
        
        try{
            update item;
        }catch(Exception ex){
            throw new AuraHandledException('Failed to update the checklist item!');
        }
        return item;
    }
    
    @AuraEnabled
    public static ChecklistItem__c getItem(Id identifier){
        List<ChecklistItem__c> item = [SELECT Id,Name,Description__c,Completation_Status__c, Status__c, Completed_At__c 
                                 FROM ChecklistItem__c
                                 WHERE Id =: identifier];
        if(item.size() > 0){
            return item.get(0);
        }else{
            return null;
        }
    }
    
    
    @AuraEnabled
    public static String getHeading(){
        String headingV = '';
        List<HeadingChecklist__c> hv = [SELECT Heading__c FROM HeadingChecklist__c];
        if(hv.size() > 0){
            headingV = hv.get(0).Heading__c;
        }

        //Id System Administrator = 00e1r000002BdHlAAK
        /**system.debug(HeadingChecklist__c.getInstance('00e1r000002BdHlAAK'));**/
        return headingV;
    }
    
    @AuraEnabled
    public static void updateHeading(String heading){
        List<HeadingChecklist__c> hv = [SELECT Heading__c FROM HeadingChecklist__c];
        
        try{
            if(hv.size() > 0){
                hv.get(0).Heading__c = heading;
                update hv;
            }
        }catch(Exception ex){
            throw new AuraHandledException('Failed to update the heading!');
        }
    }
    
    @AuraEnabled
    public static List<String> getFilters(){
        
        Schema.DescribeFieldResult fieldResult = ChecklistItem__c.Status__c.getDescribe();
        List<Schema.PicklistEntry> picklistList = fieldResult.getPicklistValues();
        List<String> valuesList = new List<String>();
        valuesList.add('All');
        for(Schema.PicklistEntry ple : picklistList){
            valuesList.add(ple.getValue());
        }
        
        return valuesList;
        
    }
}