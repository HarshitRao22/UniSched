package com.examscheduler.service;

import com.examscheduler.dto.ScheduledExamDTO;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Builds a simple, printable PDF of the generated exam timetable.
 * Plain table layout - no charts, no styling library, kept intentionally basic.
 */
@Service
public class PdfReportService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    public byte[] generateTimetablePdf(List<ScheduledExamDTO> schedule) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try (PdfDocument pdfDocument = new PdfDocument(new PdfWriter(outputStream));
             Document document = new Document(pdfDocument)) {

            document.add(new Paragraph("Exam Timetable")
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("Smart Exam Scheduling and Timetable Management System")
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            Table table = new Table(UnitValue.createPercentArray(new float[]{12, 10, 10, 22, 14, 12, 10, 10}));
            table.setWidth(UnitValue.createPercentValue(100));

            addHeaderCell(table, "Date");
            addHeaderCell(table, "Start");
            addHeaderCell(table, "End");
            addHeaderCell(table, "Course");
            addHeaderCell(table, "Branch");
            addHeaderCell(table, "Sem");
            addHeaderCell(table, "Room");
            addHeaderCell(table, "Students");

            for (ScheduledExamDTO exam : schedule) {
                table.addCell(new Cell().add(new Paragraph(exam.getExamDate().format(DATE_FORMAT))));
                table.addCell(new Cell().add(new Paragraph(exam.getStartTime().format(TIME_FORMAT))));
                table.addCell(new Cell().add(new Paragraph(exam.getEndTime().format(TIME_FORMAT))));
                table.addCell(new Cell().add(new Paragraph(exam.getCourseCode() + " - " + exam.getCourseName())));
                table.addCell(new Cell().add(new Paragraph(exam.getBranch())));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(exam.getSemester()))));
                table.addCell(new Cell().add(new Paragraph(exam.getRoomNumber())));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(exam.getStudentCount()))));
            }

            if (schedule.isEmpty()) {
                document.add(new Paragraph("No timetable has been generated yet.")
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginTop(20));
            } else {
                document.add(table);
            }
        }

        return outputStream.toByteArray();
    }

    private void addHeaderCell(Table table, String text) {
        Cell cell = new Cell().add(new Paragraph(text).setBold());
        cell.setBackgroundColor(ColorConstants.LIGHT_GRAY);
        table.addHeaderCell(cell);
    }
}
