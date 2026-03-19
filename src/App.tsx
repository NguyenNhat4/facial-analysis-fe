import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Chat from "@/pages/chat";
import FacialAnalysisPage from "@/pages/facial-analysis";
import CephAnalysisPage from "@/pages/ceph-analysis";
import DemoPage from "@/pages/demo";
import NotFound from "@/pages/not-found";
import Treatment from "./TreatmentPlan";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DemoPage} />
      <Route path="/chat" component={Chat} />
      <Route path="/facial-analysis" component={FacialAnalysisPage} />
      <Route path="/ceph-analysis" component={CephAnalysisPage} />
      <Route path="/treatment-plan" component={Treatment} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
