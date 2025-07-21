"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginBottom: 15,
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
    fontSize: 11,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  signatureContainer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 10,
    width: 250,
  },
  signatureImage: {
    width: 150,
    height: 75,
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

export default function ContractTemplate() {
  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Contrato de Transporte Escolar</Text>

        <View style={styles.section}>
          <Text style={styles.text}>
            Este contrato se celebra el {today}, entre el representante legal
            del estudiante y la empresa de transporte.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Estudiante</Text>
          <Text style={styles.text}>Nombre Completo: Santiago Montero</Text>
          <Text style={styles.text}>Email: santiago.montero@example.com</Text>
          <Text style={styles.text}>Teléfono: 123456789</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Facturación</Text>
          <Text style={styles.text}>Nombre de Facturación: Juan Pérez</Text>
          <Text style={styles.text}>Documento de Identidad: 1234567890</Text>
          <Text style={styles.text}>
            Dirección de Facturación: Calle Falsa 123
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Firma del Representante</Text>
          {/* Placeholder for signature image */}
          <View style={styles.signatureContainer}>
            <Text style={styles.text}>Firma Autorizada</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Este es un documento generado automáticamente.
        </Text>
      </Page>
    </Document>
  );
}
