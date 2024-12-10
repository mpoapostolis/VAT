import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanyHeaderProps {
  mode: "view" | "edit";
  onDownload?: () => void;
}

export function CompanyHeader({ mode, onDownload }: CompanyHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/companies")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        {mode === "view" && (
          <>
            <Button
              variant="outline"
              onClick={onDownload}
              className="border-gray-200 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={() => navigate("edit")}
              className="bg-[#0066FF] hover:bg-blue-600"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Company
            </Button>
          </>
        )}

        {mode === "edit" && (
          <>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="company-form"
              className="bg-[#0066FF] hover:bg-blue-600"
            >
              Save Changes
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
