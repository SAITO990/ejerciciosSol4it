/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @author Andres Felipe Rolon
 */
define([], () => {

    function saveRecord(context) {
        const { currentRecord } = context;
        const lineCount = currentRecord.getLineCount({ sublistId: 'item' });
        let total = 0;

        for (let i = 0; i < lineCount; i++) {
            const quantity = currentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: i
            });
            total += quantity;
        }

        if (total > 25) {
            alert("La suma de las líneas no puede superar 25.");
            return false;
        }
    }

    function validateDelete(context) {
        const { currentRecord, line } = context;

        if (confirm('¿Estás seguro de que deseas eliminar esta línea?')) {
            currentRecord.removeLine({ sublistId: 'item', line: line });
            return true;
        }

        return false;
    }

    return {
        saveRecord,
        validateDelete
    };
});
