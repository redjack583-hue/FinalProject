using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TbayIndigenousSupportHub.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAddressToEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Events",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Events");
        }
    }
}
