document.addEventListener('DOMContentLoaded', () => {
    const pdfs = [];
    const infoTrabajadores = [];
  
    const pdfUpload = document.getElementById('pdfUpload');
    const addPdf = document.getElementById('addPdf');
    const pdfList = document.getElementById('pdfList');
  
    const addWorker = document.getElementById('addWorker');
    const individualsContainer = document.getElementById('individualsContainer');
  
    const form = document.getElementById('submissionForm');
    const submitButton = form.querySelector('button[type="submit"]'); // Select the "Submit" button
  
    addPdf.addEventListener('click', () => {
      const file = pdfUpload.files[0];
      if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = reader.result.split(',')[1];
          pdfs.push(fileData);
          const li = document.createElement('li');
          li.textContent = file.name;

          const removeButton = document.createElement('button');
          removeButton.type = 'button';
          removeButton.textContent = 'Remove';
          removeButton.style.marginLeft = '10px';
          li.appendChild(removeButton);

          pdfList.appendChild(li);

          // Add event listener to the Remove button
          removeButton.addEventListener('click', () => {
            // Remove the file from the pdfFiles array
            const index = pdfs.indexOf(fileData);
            if (index > -1) {
              pdfs.splice(index, 1);
            }

            // Remove the list item from the DOM
            li.remove();
          });          
        };
        reader.readAsDataURL(file);
        pdfUpload.value = '';
      } else {
        alert('Please select a valid PDF file.');
      }
    });
  
    addWorker.addEventListener('click', () => {
      const workerDiv = document.createElement('div');
      workerDiv.className = 'worker';
      workerDiv.innerHTML = `
        <label>Name:</label>
        <input type="text" required>
        
        <label>ID Number:</label>
        <input type="text" required>
        
        <label>ID Type:</label>
        <select required>
          <option value="CC">CC</option>
          <option value="CE">CE</option>
          <option value="Passport">Passport</option>
          <option value="PEP">PEP</option>
          <option value="PPT">PPT</option>
        </select>
        <button type="button" class="deleteWorker">Delete</button>
      `;
      individualsContainer.appendChild(workerDiv);

      // Add event listener to the Delete button
      workerDiv.querySelector('.deleteWorker').addEventListener('click', () => {
        workerDiv.remove(); // Remove the worker's information block from the DOM
      });

    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Disable the submit button
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';

      const nitEmpresa = document.getElementById('nitEmpresa').value;
      const fechaIngreso = document.getElementById('fechaIngreso').value;
      const fechaSalida = document.getElementById('fechaSalida').value;
  
      infoTrabajadores.length = 0;
      document.querySelectorAll('.worker').forEach(worker => {
        const inputs = worker.querySelectorAll('input, select');
        infoTrabajadores.push({
          nombre: inputs[0].value,
          numeroDocumento: inputs[1].value,
          tipoDocumento: inputs[2].value
        });
      });
  
      const payload = {
        nitEmpresa,
        fechaIngreso,
        fechaSalida,
        pdfs,
        infoTrabajadores
      };

      try {
        const response = await fetch('http://127.0.0.1:8888/register_ingress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        if (response.ok) {
          const data = await response.json();
          alert('Submission Successful!');
          console.log('Server Response:', data);
        } else {
          alert('Submission Failed! Please try again.');
          console.error('Error Response:', await response.text());
        }
      } catch (error) {
        alert('An error occurred during submission. Please check your connection.');
        console.error('Network Error:', error);
      } finally {
        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
      }

    });


  });
  