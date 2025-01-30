import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import {
  BooleanQuestion,
  DropdownQuestion,
  LikertScaleQuestion,
  LongTextQuestion,
  MatrixMultipleChoiceQuestion,
  MultipleChoiceQuestion,
  RatingScaleQuestion,
  ShortTextQuestion,
  SliderQuestion,
  MatrixCheckboxQuestion,
  NumberQuestion,
  StarRatingQuestion,
  SingleChoiceQuestion,
} from "../pdf/questions";
import { CheckboxQuestion } from "../pdf/questions";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    color: "#5B03B2",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: "#666",
  },
  question: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  section: {
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 10,
  },
  banner: {
    width: "100%",
    height: 96,
    marginBottom: 20,
  },
});

interface SurveyPDFDocumentProps {
  surveyData: {
    logo_url?: string;
    header_url?: string;
    topic?: string;
    description?: string;
    sections: {
      questions: {
        question: string;
        question_type: string;
        options?: string[];
        rows?: string[];
        columns?: string[];
        is_required?: boolean;
      }[];
    }[];
  };
}

const SurveyPDFDocument = ({ surveyData }: SurveyPDFDocumentProps) => {
  if (!surveyData) {
    return null;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo */}
        {surveyData.logo_url && (
          <View style={styles.section}>
            <Image src={surveyData.logo_url} style={styles.logo} />
          </View>
        )}

        {/* Header Banner */}
        {surveyData.header_url && (
          <View style={styles.section}>
            <Image src={surveyData.header_url} style={styles.banner} />
          </View>
        )}

        {/* Survey Topic */}
        <View style={styles.section}>
          <Text style={styles.header}>{surveyData.topic}</Text>
          <Text style={styles.description}>{surveyData.description}</Text>
        </View>

        {/* Questions */}
        {surveyData.sections[0]?.questions?.map((item, index) => (
          <View key={index} style={styles.section}>
            {item.question_type === "checkbox" ? (
              <CheckboxQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
              />
            ) : item.question_type === "multiple_choice" ? (
              <MultipleChoiceQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
              />
            ) : item.question_type === "single_choice" ? (
              <SingleChoiceQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
              />
            ) : item.question_type === "drop_down" ? (
              <DropdownQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
              />
            ) : item.question_type === "boolean" ? (
              <BooleanQuestion question={item.question} index={index + 1} />
            ) : item.question_type === "short_text" ? (
              <ShortTextQuestion question={item.question} index={index + 1} />
            ) : item.question_type === "long_text" ? (
              <LongTextQuestion question={item.question} index={index + 1} />
            ) : item.question_type === "slider" ? (
              <SliderQuestion question={item.question} index={index + 1} />
            ) : item.question_type === "likert_scale" ? (
              <LikertScaleQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
              />
            ) : item.question_type === "rating_scale" ? (
              <RatingScaleQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
              />
            ) : item.question_type === "star_rating" ? (
              <StarRatingQuestion question={item.question} index={index + 1} />
            ) : item.question_type === "matrix_multiple_choice" ? (
              <MatrixMultipleChoiceQuestion
                question={item.question}
                rows={item.rows}
                columns={item.columns}
                index={index + 1}
              />
            ) : item.question_type === "matrix_checkbox" ? (
              <MatrixCheckboxQuestion
                question={item.question}
                rows={item.rows}
                columns={item.columns}
                index={index + 1}
              />
            ) : item.question_type === "number" ? (
              <NumberQuestion question={item.question} index={index + 1} />
            ) : null}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default SurveyPDFDocument;
