"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Download, FileText } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios-instance";
import { Skeleton } from "@/components/ui/skeleton";

interface Report {
  _id: string;
  survey_id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  __v: number;
}

interface ReportsResponse {
  data: Report[];
  total: number;
  page: number;
  page_size: number;
}

const ReportPage = () => {
  const { id: surveyId } = useParams();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery<ReportsResponse>({
    queryKey: ["reports", surveyId, page],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/survey/analysis/survey-report?page=${page}&page_size=${pageSize}&survey_id=${surveyId}`
      );
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reportId: string) => {
      await axiosInstance.delete(`/survey/analysis/survey-report/${reportId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete report");
    },
  });

  const handleDownload = (url: string, name: string) => {
    window.open(url, "_blank");
  };

  console.log(reports);

  return (
    <div className="container mx-auto py-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Survey Reports</h1>

      {!isLoading && (!reports?.data || reports.data.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reports yet
          </h3>
          <p className="text-sm text-gray-500">
            Once you generate reports from the analysis section, they will
            appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : reports?.data.map((report) => (
                      <TableRow key={report._id}>
                        <TableCell>{report.name}</TableCell>
                        <TableCell>
                          {format(new Date(report.createdAt), "PPpp")}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleDownload(report.url, report.name)
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                              className="z-[100000]"
                              overlayClassName="z-[100000]"
                            >
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Report
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this report?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteMutation.mutate(report._id)
                                  }
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={!reports || reports.data.length < pageSize}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportPage;
