import axios from "axios"

const CLIENT_ID = "tu id del cliente"
const SECRET = "tu secret de paypal"

const auth = { user: CLIENT_ID, pass: SECRET }

const createOrder = async (product) => {
    let amount = product.quantity * product.price
    console.log(amount)
    console.log("Entro a create order")
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64')}`,
      };
      const data = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'MXN', //https://developer.paypal.com/docs/api/reference/currency-codes/
                value: amount
            }
        }],
        application_context: {
            brand_name: `CervezApp.com`,
            landing_page: 'NO_PREFERENCE', // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
            user_action: 'PAY_NOW', // Accion para que en paypal muestre el monto del pago
            return_url: `http://localhost:3005/execute-payment`, // Url despues de realizar el pago
            cancel_url: `http://localhost:3005/cancel-payment` // Url despues de realizar el pago
        }
    } 
    

  try {
    const response = await axios.post(
      'https://api.sandbox.paypal.com/v2/checkout/orders',
      data,
      { headers }
    );
    console.log("Vengo del response")
    console.log(response.data.link)
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    return null;
  }
}

const executePayment = async (req, res) => {
    const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
    const token = req.query.token;
  
    const auth = {
      username: CLIENT_ID,
      password: SECRET,
    };
  
    try {
      // Hacer una solicitud a la API de PayPal para obtener un token de acceso
      const { data: { access_token } } = await axios.post(
        `${PAYPAL_API}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          auth,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      // Realizar la solicitud de captura de pago con el token de acceso
      const response = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      let product = {
        status: response.data.status,
        firstname: response.data.payer.name.given_name,
        lastname: response.data.payer.name.surname,
        amount: response.data.purchase_units[0].payments.captures[0].amount.value,
        unit: response.data.purchase_units[0].payments.captures[0].amount.currency_code
      }
      console.log(product)
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).send('Ha ocurrido un error');
    }
  };

export { createOrder, executePayment }