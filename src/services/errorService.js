export default class ErrorService {
    static showErrorInAlert(error) {
       console.log('Error:', error);
       alert('Erreur rencontrée : '+ error.message);
    }
}