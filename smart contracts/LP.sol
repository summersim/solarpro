// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// IERC20 Interface
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract SLRLDNSwap {
    IERC20 public immutable ldnToken;
    IERC20 public immutable slrToken;

    address public gridMaintainer;
    address public administrator;

    uint256 public reserveLDN;
    uint256 public reserveSLR;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(address _ldnToken, address _slrToken, address _gridMaintainer, address _administrator) {
        ldnToken = IERC20(_ldnToken);
        slrToken = IERC20(_slrToken);
        administrator = _administrator;
        gridMaintainer = _gridMaintainer;
    }

    function _mint(address _to, uint256 _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint256 _amount) private {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }

    function _update(uint256 _reserveLDN, uint256 _reserveSLR) private {
        reserveLDN = _reserveLDN;
        reserveSLR = _reserveSLR;
    }

    function swapTokens(address _tokenIn, uint256 _amountIn) external returns (uint256 amountOut) {
        require(
            _tokenIn == address(ldnToken) || _tokenIn == address(slrToken),
            "invalid token"
        );
        require(_amountIn > 0, "amount in = 0");

        bool isLDN = _tokenIn == address(ldnToken);

        if (isLDN) { // Scenario when SLR is being purchased with LDN tokens
            (IERC20 tokenIn, IERC20 tokenOut, uint256 reserveIn, uint256 reserveOut) = (ldnToken, slrToken, reserveLDN, reserveSLR);
            uint256 amountInWithFee = (_amountIn * 992) / 1000;  // 0.3% fee for LPs, 0.5% tax for grid maintainer 
            uint256 taxedAmount = (_amountIn * 5) / 1000;
            amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
            tokenIn.transferFrom(msg.sender, address(this), _amountIn - taxedAmount);
            // Transfer the tax to the grid maintainer
            tokenIn.transferFrom(msg.sender, gridMaintainer, taxedAmount);
            tokenOut.transfer(msg.sender, amountOut);
        } else { // Case where SLR is added to the pool, and LDN is taken out
            (IERC20 tokenIn, IERC20 tokenOut, uint256 reserveIn, uint256 reserveOut) = (slrToken, ldnToken, reserveSLR, reserveLDN);
            uint256 amountInWithFee = (_amountIn * 997) / 1000;  // 0.3% fee for LPs, no tax on selling SLR.
            amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
            tokenIn.transferFrom(msg.sender, address(this), _amountIn);
            tokenOut.transfer(msg.sender, amountOut);
        }
        _update(ldnToken.balanceOf(address(this)), slrToken.balanceOf(address(this)));
    }

    function addLiquidity(uint256 _amountLDN, uint256 _amountSLR) external returns (uint256 shares) {
        ldnToken.transferFrom(msg.sender, address(this), _amountLDN);
        slrToken.transferFrom(msg.sender, address(this), _amountSLR);

        if (totalSupply == 0) {
            shares = _sqrt(_amountLDN * _amountSLR);
        } else {
            shares = _min(
                (_amountLDN * totalSupply) / reserveLDN,
                (_amountSLR * totalSupply) / reserveSLR
            );
        }
        require(shares > 0, "shares = 0");
        _mint(msg.sender, shares);

        _update(ldnToken.balanceOf(address(this)), slrToken.balanceOf(address(this)));
    }

    function removeLiquidity(uint256 _shares) external returns (uint256 amountLDN, uint256 amountSLR) {
        uint256 balLDN = ldnToken.balanceOf(address(this));
        uint256 balSLR = slrToken.balanceOf(address(this));

        amountLDN = (_shares * balLDN) / totalSupply;
        amountSLR = (_shares * balSLR) / totalSupply;
        require(amountLDN > 0 && amountSLR > 0, "amountLDN or amountSLR = 0");

        _burn(msg.sender, _shares);
        _update(balLDN - amountLDN, balSLR - amountSLR);

        ldnToken.transfer(msg.sender, amountLDN);
        slrToken.transfer(msg.sender, amountSLR);
    }

    function slashStake(address user, uint256 amountToClaim) external returns (uint amountLDN, uint amountSLR) {
        require(msg.sender == administrator, "Only the administrator can slash stake");
        uint256 _shares = balanceOf[user];

        amountLDN = (_shares * reserveLDN) / totalSupply;
        amountSLR = (_shares * reserveSLR) / totalSupply;
        require(amountLDN > 0 && amountSLR > 0, "amountLDN or amountSLR = 0");
        require(amountLDN >= amountToClaim, "User stake is not enough to claw back claim");

        _burn(user, _shares);
        _update(reserveLDN - amountLDN, reserveSLR - amountSLR);

        ldnToken.transfer(user, amountLDN - amountToClaim);
        ldnToken.transfer(user, amountToClaim);
        slrToken.transfer(user, amountSLR);
    }

    function _sqrt(uint256 y) private pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        return x <= y ? x : y;
    }
}
