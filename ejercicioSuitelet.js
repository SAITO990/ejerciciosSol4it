/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @author Andres Felipe Rolon
 */

define(['N/ui/serverWidget', 'N/record'], (serverWidget, record) => {

 
    const createLeadForm = (request, response) => {
      if (request.method === 'GET') {
 
        const form = serverWidget.createForm({
          title: 'Formulario de Conversión de Leads'
        });
  
        form.addField({
          id: 'custpage_name',
          type: serverWidget.FieldType.TEXT,
          label: 'Nombre'
        });
  
        form.addField({
          id: 'custpage_email',
          type: serverWidget.FieldType.EMAIL,
          label: 'Correo Electrónico'
        });
  
        form.addField({
          id: 'custpage_phone',
          type: serverWidget.FieldType.PHONE,
          label: 'Número de Teléfono'
        });
  
        const leads = ['Lead 1', 'Lead 2', 'Lead 3'];
  
        const leadDropdown = form.addField({
          id: 'custpage_lead_dropdown',
          type: serverWidget.FieldType.SELECT,
          label: 'Selecciona un Lead Existente'
        });
  
        leadDropdown.addSelectOption({
          value: '',
          text: ''
        });
  
        leads.forEach(lead => {
          leadDropdown.addSelectOption({
            value: lead,
            text: lead
          });
        });
  
        form.addSubmitButton({
          label: 'Convertir Lead'
        });
  
        
        response.writePage(form);
  
      } else if (request.method === 'POST') {
   
        const name = request.parameters.custpage_name;
        const email = request.parameters.custpage_email;
        const phone = request.parameters.custpage_phone;
  
       
        const leadRecord = record.create({
          type: record.Type.LEAD,
          isDynamic: true
        });
  
        leadRecord.setValue({
          fieldId: 'firstname',
          value: name
        });
  
        leadRecord.setValue({
          fieldId: 'email',
          value: email
        });
  
        leadRecord.setValue({
          fieldId: 'phone',
          value: phone
        });
  
        const leadId = leadRecord.save();
  
       
        const pageContent = `<h2>¡Gracias por unirse a nosotros!</h2>
          <p>Se ha creado un nuevo cliente potencial con ID: ${leadId}</p>`;
  
        response.write(pageContent);
      }
    };
  
    return {
      onRequest: createLeadForm
    };
  });