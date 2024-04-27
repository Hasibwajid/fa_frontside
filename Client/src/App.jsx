import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Update this line
import JobsPage from './ClientPages/JobsPage';
import ProposalsPage from './ClientPages/ProposalsPage';
import ProposalDetailPage from './ClientPages/ReviewproposalPage';
import FreelancerProposals from './FreelancerPages/Proposals';
import FreelancerHome from './FreelancerPages/HomePage';
import Profile from './FreelancerPages/Profile';
import JobDetailPage from './FreelancerPages/JObDetailPage';
import SendProposalPage from './FreelancerPages/SendProposalPage';
import freelancerProposalDetailPage from './FreelancerPages/SentProposalDetailPage';
import TransitionRoutes from './Components/TransitionRoutes';
import './App.css'
import Layout from './Components/Layout/Layout';
import GuestHome from './GuestPage/GuestHome';
import PostJob from './ClientPages/PostJob';
import SignUp from './Auth/Register/SignUp';
import LoginForm from './Auth/Login/Login';
import NotFound from './Components/NotFound';
import MessagesPage from './Chat/MessagePage';
import HirePage from './ClientPages/HirePage';
import ContractsPage from './ClientPages/Contracts';
import FindFreelancer from './ClientPages/FindFreelancerPage';
import AboutUsPage from './Components/AboutUs';
import ContactUsPage from './Components/ContactUsPage';
import HowItWorksPage from './Components/HowItWorksPage';
import TermsOfServicePage from './Components/TermsOfService';
import PrivacyPolicyPage from './Components/PrivacyPolicyPage';

const App = () => {
  return (
    <Router>
      <Layout>
      <TransitionRoutes>
        <Route exact path="/jobsPage" component={JobsPage} />
        <Route path="/proposals/:jobId" component={ProposalsPage} />
        <Route path="/proposal/:proposalId" component={ProposalDetailPage} />
        <Route path="/freelancerHome" component={FreelancerHome} />
        <Route path="/freelancerProposals" component= {FreelancerProposals} />
        <Route path="/freelancerProfile" component={Profile} />
        <Route path="/jobDetail/:jobId" component={JobDetailPage}  />
        <Route path="/SendProposal/:jobId" component={SendProposalPage}  />
        <Route path="/proposalDetail/:jobId" component={freelancerProposalDetailPage}  />
        <Route path="/PostJob" component={PostJob}  />
        <Route path ="/HirePage/:proposalId" component={HirePage} />
        <Route path ="/Contracts" component={ContractsPage} />
        <Route path ="/Freelancers" component={FindFreelancer} />
        <Route path="/SignUp" component={SignUp}  />
        <Route path="/AboutUs" component={AboutUsPage}  />
        <Route path="/ContactUs" component={ContactUsPage}  />
        <Route path="/HowItWorks" component={HowItWorksPage}  />
        <Route path="/TermsOfServices" component={TermsOfServicePage}  />
        <Route path="/Privacy$Policy" component={PrivacyPolicyPage}  />
        <Route path="/Login" component={LoginForm} />
        <Route exact path="/" component={GuestHome} />
          {/* New route for MessagesPage */}
       <Route path="/messages" component={MessagesPage} />

        <Route path="/*" component={NotFound} />


      </TransitionRoutes>
      </Layout>
    </Router>
  );
};

export default App;
