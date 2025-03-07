import SuperTasksMenu from "../../assets/images/menu.png";
import { shallowEqual, useSelector } from "react-redux";
import { getSteps } from "../../redux/workspace/workspace.selector";
import OnboardingWorkspace from "../../components/onboarding-workspace/onboarding-workspace";
import OnboardingInvitedMembers from "../../components/onboarding-invited-members/onboarding-invited-members";
import withLoading from "../../hoc/loading/loading";
import { FC } from "react";
import QuadrantLayout from "../../components/quadrant-layout/quadrant-layout";
import { NavLink } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../configs/app-configs";

type CreateFirstWorkspaceProps = {
  setLoading?: (isLoading: boolean) => void;
};

const CreateFirstWorkspace: FC<CreateFirstWorkspaceProps> = ({
  setLoading,
}) => {
  const steps = useSelector(getSteps, shallowEqual);

  return (
    <div className="h-screen flex">
      <div className="md:flex w-1/2 justify-around items-center border-0 border-black border-r-[1px] hidden">
        {/* <div className="flex flex-col cursor-pointer">
          <div className="text-black p-1 flex items-center">
            <img
              src={SuperTasksMenu}
              width={27}
              className="animate-rotate"
              alt="supertasks.io menu"
            />
            <p className="ml-5 text-lg md:text-2xl font-poppins-bold">
              supertasks.io
            </p>
          </div>
          <p className="text-xs text-do-later bg-do-later-alpha px-3 py-2 rounded-md text-center">
            Quick decision making tool
          </p>
        </div> */}
        <QuadrantLayout steps={steps} />
      </div>
      <div className="absolute top-0 w-full text-black py-5 p-1 flex items-center md:hidden justify-center border-0 border-black border-b-[1px]">
        <NavLink
          to={`${APP_PREFIX_PATH}`}>
          <img
            src={SuperTasksMenu}
            width={27}
            className="animate-rotate"
            alt="supertasks.io menu"
          />
        </NavLink>
        <p className="ml-5 text-lg md:text-2xl font-poppins-medium">
          supertasks.io
        </p>
        <span className="text-xs ml-3 text-do-later bg-do-later-alpha px-3 py-2 rounded-md hidden lg:block">
          Quick decision making tool
        </span>
      </div>
      <div className="flex w-full md:w-1/2 lg:w-1/2 justify-center items-center bg-white">
        <div>
          {steps === 1 && <OnboardingWorkspace />}
          {steps === 2 && <OnboardingInvitedMembers setLoading={setLoading} />}
        </div>
      </div>
    </div>
  );
};

export default withLoading(CreateFirstWorkspace, "Creating workspace for you");
