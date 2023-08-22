/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @author Andres Felipe Rolon
 */

define(['N/record', 'N/log', 'N/search', 'N/email', 'N/runtime'], (record, log, search, email, runtime) => {
    const mode = {
        create: 'create',
        edit: 'edit'
    }

    function beforeSubmit(context) {
        const customerId = context.newRecord.getValue({ fieldId: 'entity' });
        const customer = record.load({ type: record.Type.CUSTOMER, id: customerId });
        const isRecurringCustomer = customer.getValue({ fieldId: 'custentity_cliente_recurrente' });

        const salesorderSearchObj = search.create({
            type: 'salesorder',
            filters: [
                ['type', 'anyof', 'SalesOrd'],
                'AND',
                ['name', 'anyof', '31'],
                'AND',
                ['trandate', 'within', 'previousonehalf']
            ],
            columns: [
                search.createColumn({ name: 'ordertype', sort: search.Sort.ASC, label: 'Tipo de orden' }),
                search.createColumn({ name: 'mainline', label: '*' }),
                search.createColumn({ name: 'trandate', label: 'Fecha' }),
                search.createColumn({ name: 'asofdate', label: 'Fecha de corte' }),
                search.createColumn({ name: 'postingperiod', label: 'Período' }),
                search.createColumn({ name: 'taxperiod', label: 'Período fiscal' }),
                search.createColumn({ name: 'type', label: 'Tipo' }),
                search.createColumn({ name: 'tranid', label: 'Número de documento' }),
                search.createColumn({ name: 'entity', label: 'Nombre' }),
                search.createColumn({ name: 'account', label: 'Cuenta' }),
                search.createColumn({ name: 'memo', label: 'Nota' }),
                search.createColumn({ name: 'amount', label: 'Importe' }),
                search.createColumn({ name: 'custbody_acctg_approval', label: 'Aprobación contable' })
            ]
        });

        const searchResultCount = salesorderSearchObj.runPaged().count;

        const rec = context.newRecord;

        if (isRecurringCustomer) {
            if (searchResultCount >= 1 && searchResultCount <= 5) {
                rec.setValue({ fieldId: 'discountitem', value: 'DiezPorCiento' });
            } else if (searchResultCount >= 6 && searchResultCount <= 10) {
                rec.setValue({ fieldId: 'discountitem', value: 'QuincePorCiento' });
            } else if (searchResultCount > 10) {
                rec.setValue({ fieldId: 'discountitem', value: 'VeintePorCiento' });
            }
        }
    }

    function afterSubmit(context) {
        const obj = context.newRecord;
        const discount = obj.getText('discountitem');
        const total = obj.getValue('total');
        const type = context.type;

        if (type === 'create') {
            const user = runtime.getCurrentUser();
            const body = `<h1>${user.name}</h1>
                <h2>Se aplico un descuento a su compra ${discount}, siendo el total de: ${total}</h2>`;
                
            email.send({
                author: user.id,
                body: body,
                recipients: user.id,
                subject: 'Confirmación de Transacción'
            });
        }
    }

    return {
        beforeSubmit,
        afterSubmit
    };
});
