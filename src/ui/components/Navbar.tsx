import * as React from "react";
import {
    Navbar, NavbarItem,
    NavbarBrand,
    NavbarBurger, NavbarMenu,
    NavbarStart,
    NavbarEnd
} from "bloomer";

interface IoDNavbarState {
    isActive: boolean;
}
export class IoDNavbar extends React.Component<{}, IoDNavbarState> {

    constructor(props: any) {
        super(props);
        this.state = { isActive: false };
    }
    toggleBurgerState = (event: any) => {
        this.setState({ isActive: !this.state.isActive });
    }

    render() {
        return (
            <Navbar style={{ margin: "0" }}>
                <NavbarBrand>
                    <NavbarItem>
                        <img /*src={brand}*/ style={{ marginRight: 5 }} /> IoD
                    </NavbarItem>
                    <NavbarBurger
                        isActive={this.state.isActive}
                        onClick={this.toggleBurgerState} />
                </NavbarBrand>
                <NavbarMenu
                    isActive={this.state.isActive}
                    onClick={this.toggleBurgerState}>
                    <NavbarStart>
                        <NavbarItem href="#/">Home</NavbarItem>
                    </NavbarStart>
                    <NavbarEnd>
                    </NavbarEnd>
                </NavbarMenu>
            </Navbar >
        );
    }
}
