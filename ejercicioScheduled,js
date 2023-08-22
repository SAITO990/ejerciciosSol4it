/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @author Andres Felipe Rolon Reyes
 */
define(['N/search', 'N/log', 'N/email', 'N/runtime'], (search, log, email, runtime) => {

    function execute(context) {
        try {
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
                const name = rs.getText('entity');
                const id = rs.getValue('entity');
                const amount = rs.getValue('amount');
                const date = rs.getValue('trandate');

                const sum = amount.reduce((acc, value) => acc + parseFloat(value), 0);

                const body = `<h1>${name}, el monto total de sus compras durante el año fue de: ${sum} </h1>`;
                email.send({
                    author: runtime.getCurrentUser().id,
                    body: body,
                    recipients: id,
                    subject: 'Total de compras durante el año'
                });
                return true;
            });
        } catch (e) {
            log.error('Error execute: ' + e.message, e);
        }
    }

    return {
        execute: execute
    };
});
