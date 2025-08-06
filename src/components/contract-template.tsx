"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Disable hyphenation
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
  },
  section: {
    marginBottom: 15,
    marginLeft: 30,
    marginRight: 30,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 3,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  signatureContainer: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 10,
    width: 300,
  },
  signatureImage: {
    width: 300,
    height: 120,
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "grey",
    fontSize: 10,
  },
});

type RegistrationContractSigningData = {
  studentName?: string;
  studentSurname?: string;
  documentNumber?: string;
  signature?: string;
  parentName?: string;
  parentSurname?: string;
  parentDocumentNumber?: string;
  monthlyCost?: number;
};

export default function ContractTemplate({
  studentName,
  studentSurname,
  documentNumber,
  signature,
  parentName,
  parentSurname,
  parentDocumentNumber,
  monthlyCost,
}: RegistrationContractSigningData) {
  return (
    <Document
      title="Contrato de Transporte Escolar"
      pageMode="useOutlines"
      pageLayout="singlePage"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>CONTRATO DE TRANSPORTE ESCOLAR</Text>

        <View style={styles.section}>
          <Text style={styles.text}>
            Entre la operadora de Transporte Escolar e Institucional
            TRANSFURGOSTIL C.A., representada legalmente por el Sr. FLORES
            CABEZAS ORLANDO ALONSO portador de la cédula de identidad N.-
            171058989-4, el padre, madre o representante identificados con la
            cedula de ciudadanía que aparece al pie de las firmas, en nombre del
            alumno {studentSurname || "____________________"}{" "}
            {studentName || "____________________"}, con cédula{" "}
            {documentNumber || "____________________"}, y quienes en lo sucesivo
            se llamaran PADRES DE FAMILIA, hemos celebrado el presente CONTRATO
            DE TRANSPORTE ESCOLAR que se regirá por las siguientes cláusulas:
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>PRIMERA:</Text> El
            objeto del contrato es la prestación del servicio de Transporte
            Escolar de Lunes a Viernes de los alumnos, desde su domicilio hasta
            la Unidad Educativa de La Inmaculada a fin de asistir a la jornada
            escolar diaria y puntual durante los Diez (10) meses del año
            lectivo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>SEGUNDA:</Text> El
            padre, madre de familia o representante se obliga a pagar la suma
            correspondiente en Diez (10) cuotas mensuales anticipadas dentro de
            los Diez (10 primeros) días de cada mes, empezando en
            Septiembre/2025 y terminando en Junio/2026
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>TERCERA:</Text> La
            Empresa establecerá la ruta respectiva que deban recorrer los
            vehículos asignados. El transporte recogerá y dejará a los alumnos
            en la puerta de la casa siempre y cuando sea en vías principales y
            estén dentro de la ruta y que no estén ubicados en condominios y
            pasajes cerrados o de difícil acceso, en este caso se les recogerá y
            dejará lo más cercano a su domicilio, para lo cual siempre debe
            haber una persona que los entregue y reciba en la parada.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            Por motivos de logística no se realizarán pagos de medio transporte.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              CUARTA: COSTO DEL CONTRATO:
            </Text>{" "}
            Los servicios pactados mediante el presente contrato, tiene un costo
            mensual de ${monthlyCost || "____________________"} por el Servicio
            de Transporte y que serán cancelados por los PADRES O REPRESENTANTES
            en 10 cuotas mensuales y de acuerdo a lo estipulado en la cláusula
            segunda de este mismo instrumento. El retraso en el pago de las
            cuotas ocasionara la suspensión temporal del servicio.
          </Text>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>QUINTA:</Text> La
            solicitud de suspensión del servicio de transporte solo puede
            hacerse cuando haya cambio de domicilio hacia un sector donde no
            lleguen las rutas de transporte. La solicitud del traslado de la
            ruta por cambio de residencia deberá ser presentada por escrito a la
            oficina de Transportes remitido por el padre, madre de familia o
            representante con quince (15) días de anticipación, indicando la
            nueva dirección, barrio y teléfono y cancelando oportunamente el
            valor correspondiente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>SEXTA:</Text> La
            empresa garantiza la prestación del servicio de transporte al
            mencionado alumno (a) asignando un vehículo determinado, el cual
            puede ser remplazado por otro de iguales características o en taxis
            tomando las debidas precauciones para salvaguardar la integridad de
            los estudiantes, por razones de mantenimiento, reparación u otro
            motivo, pudiendo subcontratar el servicio de transporte.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>SEPTIMA:</Text> Se
            garantiza el cumplimiento de los horarios establecidos y el traslado
            seguro de los alumnos dando cumplimiento a las leyes de tránsito,
            para lo cual la empresa capacitará a los transportistas con dos
            seminarios:
            {"\n"}1) Actualización de la nueva Ley de tránsito.
            {"\n"}2) Servicio al cliente
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>OCTAVA:</Text> El
            alumno (a) usuario (a) del transporte debe asumir un comportamiento
            de acuerdo con las normas de uso del Servicio de Transporte.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>NOVENA:</Text> El
            padre, madre de familia o representante será el responsable de que
            el alumno este en la parada o sitio designado de manera puntual y
            oportuna (3 MINUTOS ANTES DE LA HORA INDICADA) para abordar el
            vehículo. En lo posible se debe avisar cuando por enfermedad el
            alumno no asista al Colegio.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>DECIMA:</Text>{" "}
            Terminada la jornada escolar los alumnos (as) deben dirigirse
            directamente a su unidad de transporte para evitar atrasos. En caso
            de atraso el estudiante debe comunicarlo inmediatamente a la oficina
            de transporte para a su vez comunicar al representante y pueda
            acercarse a retirarlo del colegio.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              DECIMA PRIMERA:
            </Text>{" "}
            En caso de existir algún inconveniente con el transportista, el
            padre, madre o representante del alumno (a) deberá comunicarse de
            inmediato con la oficina de transporte para tomar las medidas
            correctivas y sanciones oportunas de ser el caso.
          </Text>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              DECIMA SEGUNDA:
            </Text>{" "}
            El presente contrato tiene una vigencia de diez (10) meses
            comprendidos entre el uno (1) de Septiembre de 2025 hasta el treinta
            (30) de Junio de 2026.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              DECIMA TERCERA: Aceptación.-
            </Text>{" "}
            Las partes aceptan el total contenido del presente documento. De
            conformidad con la Ley de Comercio Electrónico, Firmas Electrónicas
            y Mensajes de Datos de la República del Ecuador, las partes
            reconocen y aceptan que la suscripción de este contrato mediante su
            firma electrónica, realizada a través del trazo con el dedo o el
            ratón en la plataforma web, tiene la misma validez y efectos
            jurídicos que una firma manuscrita.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            El presente contrato se firma en la ciudad del Distrito
            Metropolitano de Quito a{" "}
            {new Date().toLocaleDateString("es-EC", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            PADRE Y/O MADRE Y/O REPRESENTANTE.
          </Text>
          {/* Signature section with image and info */}
          {signature ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={signature} style={styles.signatureImage} />
          ) : (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image
              src="/images/signing-placeholder.png"
              style={styles.signatureImage}
            />
          )}
          <View style={styles.signatureContainer}></View>
          <Text style={styles.text}>
            Nombre: {parentName || "_____________________"}{" "}
            {parentSurname || "_____________________"}
          </Text>
          <Text style={styles.text}>
            C.C. {parentDocumentNumber || "_____________________"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
