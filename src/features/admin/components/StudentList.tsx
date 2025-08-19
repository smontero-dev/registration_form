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
        additionalInfo: ""
    };

    return (
        <div>
            <StudentInfo student={student} />
        </div>
    );
}