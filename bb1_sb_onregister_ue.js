/**
 * Project : P100897
 * 
 * Description : Make 4 sites GDPR compliant
 * 
 * @Author : Gordon Truslove
 * @Date   : Sep 2018
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],

    function (record, search) {


        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type
         * @Since 2015.2
         */
        function beforeSubmit(scriptContext) {
try{
            if (scriptContext.type == scriptContext.UserEventType.CREATE||scriptContext.type == scriptContext.UserEventType.EDIT) {
                var currentRecord = scriptContext.newRecord;
                var custentity_bb1_sb_subscribe = currentRecord.getValue({
                    fieldId: 'custentity_bb1_sb_subscribe'
                });
                var custentity_bb1_sb_unsubscribe = currentRecord.getValue({
                    fieldId: 'custentity_bb1_sb_unsubscribe'
                });
                if(custentity_bb1_sb_subscribe.length==0&&custentity_bb1_sb_unsubscribe.length==0){
                    return;
                }
                if(scriptContext.oldRecord){
                    var old_custentity_bb1_sb_subscribe = scriptContext.oldRecord.getValue({
                        fieldId: 'custentity_bb1_sb_subscribe'
                    });
                    var old_custentity_bb1_sb_unsubscribe = scriptContext.oldRecord.getValue({
                        fieldId: 'custentity_bb1_sb_unsubscribe'
                    });
                    if(old_custentity_bb1_sb_subscribe==custentity_bb1_sb_subscribe&&old_custentity_bb1_sb_unsubscribe==custentity_bb1_sb_unsubscribe){
                        return;
                    }
                }
                log.debug("GDPR Update",(custentity_bb1_sb_subscribe)+"-"+(custentity_bb1_sb_unsubscribe));
                
                if(custentity_bb1_sb_subscribe){
                    custentity_bb1_sb_unsubscribe=false;
                    currentRecord.setValue({
                        fieldId: 'globalsubscriptionstatus',
                        value: 1,
                        ignoreFieldChange: true
                    });
                }
                else if(custentity_bb1_sb_unsubscribe){
                    custentity_bb1_sb_subscribe=false;
                    currentRecord.setValue({
                        fieldId: 'globalsubscriptionstatus',
                        value: 2,
                        ignoreFieldChange: true
                    });
                }else{
                    custentity_bb1_sb_subscribe=false;
                    custentity_bb1_sb_unsubscribe=false;
                    currentRecord.setValue({
                        fieldId: 'globalsubscriptionstatus',
                        value: 2,
                        ignoreFieldChange: true
                    });
                }
                currentRecord.setValue({
                    fieldId: 'custentitygdprsub',
                    value: custentity_bb1_sb_subscribe,
                    ignoreFieldChange: true
                });
                currentRecord.setValue({
                    fieldId: 'custentitygdprunsub',
                    value: custentity_bb1_sb_unsubscribe,
                    ignoreFieldChange: true
                });
                
            }
        }catch(e){
            log.error("GDPR",e);
        }
        }

        return {
            beforeSubmit: beforeSubmit
        };

    });