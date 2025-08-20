import StudentInfo from "./StudentInfo";
import { Student } from "@/types";

export default function StudentList() {
    const student: Student = {
        housePhone: "3430525",
        location: {
            afternoon: {
                lng: "-78.47202830180733",
                lat: "-0.06826341501805926"
            },
            morning: {
                lng: "-78.47202830180733",
                lat: "-0.06826341501805926"
            }
        },
        grade: "TERCERO DE BACHILLERATO B",
        billingInfo: {
            address: "Paseo del Sol y paraíso ",
            documentType: "CÉDULA",
            phone: "0987024379",
            surname: "Lastra Castillo ",
            documentNumber: "1710439355",
            name: "José Luis ",
            email: "lastradomenica@gmail.com"
        },
        documentType: "CÉDULA",
        studentName: "Doménica Alejandra ",
        signatureType: "ONLINE_SIGNATURE",
        createdAt: "2025-08-15T14:29:03.476988",
        email: "lastradomenica@gmail.com",
        streetInfo: {
            afternoon: {
                mainStreet: "Paseo del Sol ",
                referencePoints: "Lamosam",
                neighborhood: "Pusuqui",
                secondaryStreet: "Paraíso "
            },
            morning: {
                mainStreet: "Paseo del Sol ",
                referencePoints: "Lamosam",
                neighborhood: "Pusuqui",
                secondaryStreet: "Paraíso "
            }
        },
        studentSurname: "Lastra Quezada",
        documentNumber: "1729162758",
        parentPhone: "0987039525",
        isNewStudent: false,
        secondaryPhone: "0987024379",
        price: "73",
        id: "2daba1ee-e4e7-4d67-8683-4dd3439afc5f",
        additionalInfo: "",
        route: {
            morning: "ruta-1",
            afternoon: ""
        }
    };

    // const student: Student = {
    //     housePhone: "025172883",
    //     location: {
    //         afternoon: {
    //             lng: "-78.4770060037252",
    //             lat: "-0.1441812565657886"
    //         },
    //         morning: {
    //             lng: "",
    //             lat: ""
    //         }
    //     },
    //     grade: "SEGUNDO DE BACHILLERATO B",
    //     billingInfo: {
    //         address: "Dammer II",
    //         documentType: "CÉDULA",
    //         phone: "0999696974",
    //         surname: "Coba Maldonado ",
    //         documentNumber: "1711731503",
    //         name: "Shyrley ",
    //         email: "shirley_coba_md@hotmail.com"
    //     },
    //     documentType: "CÉDULA",
    //     studentName: "Sophia Alejandra ",
    //     signatureType: "ONLINE_SIGNATURE",
    //     createdAt: "2025-08-07T15:09:13.213834",
    //     email: "shirley_coba_md@hotmail.com",
    //     streetInfo: {
    //         afternoon: {
    //             mainStreet: "Pasaje3",
    //             referencePoints: "A media cuadra del Colegio Don Bosco Kennedy",
    //             neighborhood: "Dammer II",
    //             secondaryStreet: "Edificio Niza"
    //         },
    //         morning: {
    //             mainStreet: "",
    //             referencePoints: "",
    //             neighborhood: "",
    //             secondaryStreet: ""
    //         }
    //     },
    //     studentSurname: "Aguirre Coba ",
    //     documentNumber: "1754543054",
    //     parentPhone: "0999696974",
    //     isNewStudent: false,
    //     secondaryPhone: "",
    //     price: "50",
    //     id: "48461910-2b13-43d4-999a-33aed1665d1f",
    //     additionalInfo: "El recorrido es solo para la tarde.\nEl paralelo aún no está definido va a Segundo de Bachillerato.",
    // }

    return (
        <div>
            <StudentInfo student={student} />
        </div>
    );
}