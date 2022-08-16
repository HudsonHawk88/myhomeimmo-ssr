import React from 'react';
import { UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap';
import KeresoForm from '../../views/Public/Fooldal/KeresoForm';
import IngatlanForm from '../../views/Public/Fooldal/IngatlanForm';

const PublicSidebar = (props) => {
    return (
        <div className="public-sidebar">
            <UncontrolledAccordion defaultOpen="1">
                {/* <div className='gyorskereso col-md-12'>
                    <AccordionItem>
                        <AccordionHeader targetId='1'>Gyorskereső</AccordionHeader>
                        <AccordionBody accordionId='1'>
                            <KeresoForm {...props} />
                        </AccordionBody>
                    </AccordionItem>
                </div> */}
                <div className="ingatlanfeladform col-md-12">
                    <AccordionItem>
                        <AccordionHeader targetId="2">Eladó ingatlana van?</AccordionHeader>
                        <AccordionBody accordionId="2">
                            <IngatlanForm />
                        </AccordionBody>
                    </AccordionItem>
                </div>
            </UncontrolledAccordion>
        </div>
    );
};

export default PublicSidebar;
