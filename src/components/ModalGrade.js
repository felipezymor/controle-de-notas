import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';
import * as api from '../api/apiService';

Modal.setAppElement('#root');

export default function ModalGrade({onSave, onClose, selectedGrade}) {

    const {id, student, subject, value, type} = selectedGrade;

    const [gradeValue, setGradeValue] = useState(value);
    const [gradeValidation, setGradeValidation] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getValidation = async () => {
            const validation = await api.getValidationFromGradeType(type);
            setGradeValidation(validation);
        }
        getValidation();
    }, [type]);
    
    useEffect(() => {
        const {minValue, maxValue} = gradeValidation;
        if(gradeValue < minValue || gradeValue > maxValue) {
            setErrorMessage(`O valor da nota deve ser de ${minValue} a ${maxValue}`);
            return;
        }
        setErrorMessage('');
    }, [gradeValue, gradeValidation]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    const handleKeyDown = (event) => {
        if(event.key === 'Escape') {
            onClose(null);
        }
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log(event);

        const formData = {
            id,
            newValue: gradeValue,
        };

        onSave(formData);
    };
    const handleGradeChange = (event) => {
        setGradeValue(+event.target.value)
    };
    const handleModalClose = () => {
        onClose(null);
    };

    return (
        <div>
            <Modal isOpen={true}>
                <div style={styles.flexRow}>
                    <span style={styles.modalTitle}>Manutenção de Notas</span>
                    <button className="waves-effect waves-light btn red dark-3" onClick={handleModalClose}>X</button>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className="input-field">
                        <input id="inputName" value={student} type="text" readOnly />
                        <label className="active" htmlFor="inputName">Nome do Aluno:</label>
                    </div>

                    <div className="input-field">
                        <input id="inputSubject" value={subject} type="text" readOnly />
                        <label className="active" htmlFor="inputSubject">Disciplina:</label>
                    </div>

                    <div className="input-field">
                        <input id="inputType" value={type} type="text" readOnly />
                        <label className="active" htmlFor="inputType">Tipo de avaliação:</label>
                    </div>

                    <div className="input-field">
                        <input 
                        id="inputGrade" 
                        min={gradeValidation.minValue} 
                        max={gradeValidation.maxValue} 
                        step='1' 
                        autoFocus 
                        value={gradeValue} 
                        onChange={handleGradeChange} 
                        type="number" />
                        <label className="active" htmlFor="inputGrade">Nota:</label>
                    </div>
                    
                    <div style={styles.flexRow}>
                        <button className="waves-effect waves-light btn" disabled={errorMessage.trim() !== ''}>Salvar</button>
                        <span style={{color: 'red'}}>{errorMessage}</span>
                    </div>
                </form>
            </Modal>
        </div>
    )
};

const styles = {
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
    },
    modalTitle: {
        fontSize: '30px',
        fontWeight: '500',
    },
    flexStart: {
        justifyContent: 'flex-start',
    }
}
