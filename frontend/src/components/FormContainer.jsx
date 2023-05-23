const FormContainer = ({ children }) => {
  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
