/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @author Andres Felipe Rolon
 */
define([], () => {

    function pageInit(context) {
        const { currentRecord, mode } = context;

        if (mode === 'create') {
            currentRecord.setValue({
                fieldId: 'entity',
                value: 31
            });
        }
    }

    function saveRecord(context) {
        const { currentRecord, mode } = context;
        const lineCount = currentRecord.getLineCount({
            sublistId: 'item'
        });

        if (lineCount < 3) {
            alert('Las transacciones deben tener más 3 líneas.');
            return false;
        }
    }

    function fieldChanged(context) {
        const { currentRecord } = context;
        const sublistValue = currentRecord.getCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'quantity',
        });

        if (sublistValue > 5) {
            alert('Debes seleccionar menos 5 unidades.');
            return false;
        }
    }

    function lineInit(context) {
        const { currentRecord, sublistId } = context;

        if (sublistId === 'item') {
            currentRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: 2
            });
        }
    }

    return {
        pageInit,
        saveRecord,
        fieldChanged,
        lineInit
    };
});
