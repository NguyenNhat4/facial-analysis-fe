import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CephAnalysisPage from "@/pages/ceph-analysis";
import DemoPage from "@/pages/demo";
import PatientListPage from "@/pages/patient-list";
import NotFound from "@/pages/not-found";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PatientListPage} />
      <Route path="/patients/:id/upload" component={DemoPage} />
      <Route path="/ceph-analysis" component={CephAnalysisPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
