/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @author Andres Felipe Rolon Reyes
 */
define(['N/search', 'N/log', 'N/email', 'N/runtime'], (search, log) => {

    function getInputData() {
        const response = [];
        const salesorderSearchObj = search.create({
            type: 'salesorder',
            filters: [
                ['type', 'anyof', 'SalesOrd'],
                'AND',
                ['mainline', 'is', 'T'],
                'AND',
                ['amount', 'greaterthan', '0.00'],
                'AND',
                ['customer.email', 'isnotempty', ''],
                'AND',
                ['trandate', 'within', 'previousoneyear']
            ],
            columns: [
                search.createColumn({ name: 'entity', label: 'Nombre' }),
                search.createColumn({ name: 'amount', label: 'Importe' }),
                search.createColumn({ name: 'trandate', label: 'Fecha' })
            ]
        });
        const searchResultCount = salesorderSearchObj.runPaged().count;
        log.debug('salesorderSearchObj result count', searchResultCount);
        salesorderSearchObj.run().each(rs => {
            const obj = {
                name: rs.getText('entity'),
                id: rs.getValue('entity'),
                amount: rs.getValue('amount'),
                date: rs.getValue('trandate')
            };
            response.push(obj);
            return true;
        });
        return response;
    }

    function map(context) {
        try {
            const salesOrder = JSON.parse(context.value);
            context.write({
                key: salesOrder.date,
                value: salesOrder.amount
            });
        } catch (e) {
            log.error('Error en map: ' + e.message, e);
        }
    }

    function reduce(context) {
        try {
            const sum = context.values.reduce((acc, value) => acc + parseFloat(value), 0);
            context.write({
                key: context.key,
                value: sum
            });
        } catch (e) {
            log.error('Error en reduce: ' + e.message, e);
        }
    }

    function summarize(context) {
        try {
            const summary = context.summary;
            const contents = `Total de ingresos en el año: ${context.value}`;
            log.audit({ title: 'Resultado: ', details: contents });
            log.audit('Time Elapsed', summary.inputSummary.seconds);
            log.audit('Time Elapsed', summary.mapSummary.seconds);
            log.audit('Time Elapsed', summary.reduceSummary.seconds);
            log.audit('Total seconds elapsed', summary.seconds);
        } catch (e) {
            log.error('Error en summarize: ' + e.message, e);
        }
    }

    return {
        getInputData,
        map,
        reduce,
        summarize
    };
});
